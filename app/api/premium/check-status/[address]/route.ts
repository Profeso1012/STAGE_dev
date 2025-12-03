import { NextResponse } from 'next/server';

interface PremiumSubscription {
  address: string;
  isPremium: boolean;
  expiresAt: number | null;
  discount: number;
}

// Mock in-memory storage for premium subscriptions
// In production, this would be stored in a database
const premiumUsers = new Map<string, PremiumSubscription>();

export async function GET(
  req: Request,
  { params }: { params: { address: string } }
) {
  try {
    const { address } = params;

    if (!address || address.length === 0) {
      return NextResponse.json(
        { error: 'Address is required' },
        { status: 400 }
      );
    }

    const normalizedAddress = address.toLowerCase();
    const subscription = premiumUsers.get(normalizedAddress);

    if (!subscription) {
      // Return default non-premium status
      return NextResponse.json({
        address: normalizedAddress,
        isPremium: false,
        expiresAt: null,
        discount: 0,
      });
    }

    // Check if subscription has expired
    if (subscription.expiresAt && subscription.expiresAt < Date.now()) {
      premiumUsers.delete(normalizedAddress);
      return NextResponse.json({
        address: normalizedAddress,
        isPremium: false,
        expiresAt: null,
        discount: 0,
      });
    }

    return NextResponse.json(subscription);

  } catch (error: any) {
    console.error('Premium check error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to check premium status' },
      { status: 500 }
    );
  }
}
