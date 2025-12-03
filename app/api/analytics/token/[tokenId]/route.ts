import { NextResponse } from 'next/server';

const SUBGRAPH_URL = process.env.NEXT_PUBLIC_SUBGRAPH_URL!;

/**
 * Fetches analytics for a specific token from the Camp Network Subgraph.
 * This is DECENTRALIZED - data comes from on-chain events.
 */
export async function GET(
    req: Request,
    { params }: { params: Promise<{ tokenId: string }> }
) {
    const { tokenId } = await params;

    try {
        // Query the Subgraph for AccessPurchased events
        const query = `
      query GetTokenAnalytics($tokenId: String!) {
        accessPurchases(where: { tokenId: $tokenId }) {
          id
          buyer
          tokenId
          price
          duration
          timestamp
        }
        ipnft(id: $tokenId) {
          id
          creator
          totalRevenue
          accessCount
        }
      }
    `;

        const response = await fetch(SUBGRAPH_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query,
                variables: { tokenId }
            })
        });

        const data = await response.json();

        if (data.errors) {
            throw new Error(data.errors[0].message);
        }

        const { accessPurchases, ipnft } = data.data;

        // Calculate analytics from on-chain data
        const totalSales = accessPurchases?.length || 0;
        const totalRevenue = accessPurchases?.reduce((sum: number, purchase: any) => {
            return sum + parseFloat(purchase.price);
        }, 0) || 0;

        // Unique buyers (some may have bought multiple times)
        const uniqueBuyers = new Set(accessPurchases?.map((p: any) => p.buyer) || []).size;

        return NextResponse.json({
            tokenId,
            totalSales,
            totalRevenue: (totalRevenue / 1e18).toFixed(6), // Convert from wei
            uniqueBuyers,
            recentPurchases: accessPurchases?.slice(0, 10) || [],
            creator: ipnft?.creator || null
        });

    } catch (error: any) {
        console.error('Analytics fetch error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch analytics' },
            { status: 500 }
        );
    }
}
