import { NextResponse } from 'next/server';

const SUBGRAPH_URL = process.env.NEXT_PUBLIC_SUBGRAPH_URL!;

/**
 * Fetches aggregated analytics for all content owned by a creator.
 * Uses the Camp Network Subgraph for decentralized, immutable data.
 */
export async function GET(
    req: Request,
    { params }: { params: Promise<{ address: string }> }
) {
    const { address } = await params;

    try {
        // Query for all IPNFTs created by this address
        const query = `
      query GetCreatorAnalytics($creator: String!) {
        ipnfts(where: { creator: $creator }) {
          id
          tokenId
          creator
          metadata
          accessPurchases {
            id
            buyer
            price
            timestamp
          }
        }
      }
    `;

        const response = await fetch(SUBGRAPH_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query,
                variables: { creator: address.toLowerCase() }
            })
        });

        const data = await response.json();

        if (data.errors) {
            throw new Error(data.errors[0].message);
        }

        const ipnfts = data.data?.ipnfts || [];

        // Aggregate analytics across all creator's content
        let totalSales = 0;
        let totalRevenue = 0;
        const uniqueBuyers = new Set<string>();

        ipnfts.forEach((nft: any) => {
            const purchases = nft.accessPurchases || [];
            totalSales += purchases.length;

            purchases.forEach((purchase: any) => {
                totalRevenue += parseFloat(purchase.price);
                uniqueBuyers.add(purchase.buyer);
            });
        });

        return NextResponse.json({
            creator: address,
            totalContent: ipnfts.length,
            totalSales,
            totalRevenue: (totalRevenue / 1e18).toFixed(6), // Convert from wei to CAMP
            uniqueCustomers: uniqueBuyers.size,
            // Note: "Views" cannot be tracked on-chain, would need off-chain analytics
            // For now, we estimate views as sales * 10 (assumption)
            estimatedViews: totalSales * 10,
            content: ipnfts.map((nft: any) => ({
                tokenId: nft.tokenId,
                sales: nft.accessPurchases?.length || 0,
                revenue: (nft.accessPurchases?.reduce((sum: number, p: any) =>
                    sum + parseFloat(p.price), 0) / 1e18).toFixed(6)
            }))
        });

    } catch (error: any) {
        console.error('Creator analytics error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch creator analytics' },
            { status: 500 }
        );
    }
}
