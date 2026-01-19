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

// Supported currencies for global payments
const SUPPORTED_CURRENCIES = ['usd', 'eur', 'gbp', 'jpy', 'cny', 'inr', 'brl', 'aud', 'cad', 'mxn', 'aed', 'sar'];

export async function POST(request: NextRequest) {
  try {
    const { planId, userId, userEmail, currency = 'usd', locale = 'en' } = await request.json();

    if (!planId || !PRICES[planId as keyof typeof PRICES]) {
      return NextResponse.json(
        { error: 'Invalid plan selected' },
        { status: 400 }
      );
    }

    const plan = PRICES[planId as keyof typeof PRICES];
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.intelligenceforall.ai';
    
    // Validate currency
    const selectedCurrency = SUPPORTED_CURRENCIES.includes(currency.toLowerCase()) 
      ? currency.toLowerCase() 
      : 'usd';

    // Production mode with Stripe
    if (stripe) {
      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        // Enable multiple payment methods for global acceptance
        payment_method_types: [
          'card',  // Visa, Mastercard, Amex, etc.
        ],
        // Additional payment methods configured in Stripe Dashboard:
        // - Apple Pay (automatic with card)
        // - Google Pay (automatic with card)
        // - Link (Stripe's one-click checkout)
        payment_method_options: {
          card: {
            setup_future_usage: 'off_session',
          },
        },
        customer_email: userEmail,
        client_reference_id: userId,
        line_items: [
          {
            price: plan.priceId,
            quantity: 1,
          },
        ],
        // Currency for display (actual charge currency set in Price)
        currency: selectedCurrency,
        // Localize checkout page
        locale: locale as Stripe.Checkout.SessionCreateParams.Locale || 'auto',
        success_url: `${appUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${appUrl}/payment/cancelled`,
        metadata: {
          userId,
          planId,
          currency: selectedCurrency,
        },
        subscription_data: {
          metadata: {
            userId,
            planId,
          },
        },
        // Enable promo codes
        allow_promotion_codes: true,
        // Collect billing address for tax purposes
        billing_address_collection: 'auto',
        // Automatic tax calculation (requires Stripe Tax setup)
        // automatic_tax: { enabled: true },
        // Customer can update payment method
        customer_update: {
          address: 'auto',
          name: 'auto',
        },
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
