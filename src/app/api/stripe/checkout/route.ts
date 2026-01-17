import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2025-12-15.clover' })
  : null;

// Update these with your actual Stripe Price IDs from the dashboard
const PRICES = {
  'pro-monthly': {
    priceId: process.env.STRIPE_PRICE_MONTHLY || 'price_monthly_xxx',
    amount: 499,
  },
  'pro-yearly': {
    priceId: process.env.STRIPE_PRICE_YEARLY || 'price_yearly_xxx',
    amount: 3999,
  },
};

export async function POST(request: NextRequest) {
  try {
    const { planId, userId, userEmail } = await request.json();

    if (!planId || !PRICES[planId as keyof typeof PRICES]) {
      return NextResponse.json(
        { error: 'Invalid plan selected' },
        { status: 400 }
      );
    }

    const plan = PRICES[planId as keyof typeof PRICES];
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.intelligenceforall.ai';

    // Production mode with Stripe
    if (stripe) {
      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        customer_email: userEmail,
        client_reference_id: userId,
        line_items: [
          {
            price: plan.priceId,
            quantity: 1,
          },
        ],
        success_url: `${appUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${appUrl}/payment/cancelled`,
        metadata: {
          userId,
          planId,
        },
        subscription_data: {
          metadata: {
            userId,
            planId,
          },
        },
        allow_promotion_codes: true,
      });

      return NextResponse.json({ sessionId: session.id, url: session.url });
    }

    // Demo mode - return mock session
    return NextResponse.json({
      sessionId: 'demo_session_' + Date.now(),
      url: `${appUrl}/payment/success?demo=true`,
    });
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
