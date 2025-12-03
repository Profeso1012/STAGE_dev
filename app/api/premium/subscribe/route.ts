import { NextResponse } from 'next/server';

// Premium plan options (in production, these would be stored in database)
const PREMIUM_PLANS = {
  monthly: {
    price: 9.99,
    durationMs: 30 * 24 * 60 * 60 * 1000, // 30 days
    discount: 0.5, // 50% discount on purchases
  },
  yearly: {
    price: 99.99,
    durationMs: 365 * 24 * 60 * 60 * 1000, // 365 days
    discount: 0.5, // 50% discount on purchases
  },
};

// Mock in-memory storage for premium subscriptions
const premiumUsers = new Map<string, any>();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { address, plan, paymentHash } = body;

    if (!address || !plan) {
      return NextResponse.json(
        { error: 'Address and plan are required' },
        { status: 400 }
      );
    }

    if (!PREMIUM_PLANS[plan as keyof typeof PREMIUM_PLANS]) {
      return NextResponse.json(
        { error: 'Invalid plan. Choose "monthly" or "yearly"' },
        { status: 400 }
      );
    }

    const normalizedAddress = address.toLowerCase();
    const planDetails = PREMIUM_PLANS[plan as keyof typeof PREMIUM_PLANS];

    // Create subscription record
    const subscription = {
      address: normalizedAddress,
      isPremium: true,
      plan,
      expiresAt: Date.now() + planDetails.durationMs,
      discount: planDetails.discount,
      startedAt: Date.now(),
      paymentHash: paymentHash || null,
    };

    // Store in mock database
    premiumUsers.set(normalizedAddress, subscription);

    // In production, you would:
    // 1. Process payment through Stripe/payment processor
    // 2. Store in database
    // 3. Send confirmation email
    // 4. Return transaction hash

    return NextResponse.json({
      success: true,
      subscription,
      message: `Premium ${plan} subscription activated. Expires at ${new Date(subscription.expiresAt).toISOString()}`,
    });

  } catch (error: any) {
    console.error('Premium subscription error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create premium subscription' },
      { status: 500 }
    );
  }
}

// Allow GET to check subscription (for testing)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get('address');

  if (!address) {
    return NextResponse.json(
      { error: 'Address is required' },
      { status: 400 }
    );
  }

  const subscription = premiumUsers.get(address.toLowerCase());
  
  if (!subscription) {
    return NextResponse.json({
      isPremium: false,
      expiresAt: null,
      discount: 0,
    });
  }

  // Check if expired
  if (subscription.expiresAt < Date.now()) {
    premiumUsers.delete(address.toLowerCase());
    return NextResponse.json({
      isPremium: false,
      expiresAt: null,
      discount: 0,
    });
  }

  return NextResponse.json(subscription);
}
