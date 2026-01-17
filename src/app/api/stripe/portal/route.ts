import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2025-12-15.clover' })
  : null;

export async function POST(request: NextRequest) {
  try {
    const { customerId } = await request.json();

    if (!customerId) {
      return NextResponse.json(
        { error: 'Customer ID required' },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.intelligenceforall.ai';

    // Production mode with Stripe
    if (stripe) {
      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${appUrl}/settings`,
      });

      return NextResponse.json({ url: session.url });
    }

    // Demo mode
    return NextResponse.json({
      url: `${appUrl}/settings?portal=demo`,
    });
  } catch (error: any) {
    console.error('Portal session error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create portal session' },
      { status: 500 }
    );
  }
}
