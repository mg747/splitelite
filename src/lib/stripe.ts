/**
 * Stripe Integration Module
 * 
 * To enable payments in production:
 * 1. Create a Stripe account at https://stripe.com
 * 2. Get your API keys from the Stripe Dashboard
 * 3. Create products and prices in Stripe
 * 4. Set environment variables:
 *    - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
 *    - STRIPE_SECRET_KEY
 *    - STRIPE_WEBHOOK_SECRET
 * 5. Install @stripe/stripe-js and stripe packages
 */

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: 'month' | 'year';
  stripePriceId: string;
  features: string[];
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'pro-monthly',
    name: 'Pro Monthly',
    description: 'Full access, billed monthly',
    price: 4.99,
    interval: 'month',
    stripePriceId: 'price_monthly_placeholder', // Replace with actual Stripe price ID
    features: [
      'Receipt scanning',
      'Advanced analytics',
      'Export to CSV/PDF',
      'Recurring expenses',
      'Payment reminders',
      'Unlimited groups',
      'Custom categories',
      'Priority support',
    ],
  },
  {
    id: 'pro-yearly',
    name: 'Pro Yearly',
    description: 'Full access, save 33%',
    price: 39.99,
    interval: 'year',
    stripePriceId: 'price_yearly_placeholder', // Replace with actual Stripe price ID
    features: [
      'Everything in Pro Monthly',
      'Save 33% vs monthly',
      'Early access to new features',
    ],
  },
];

/**
 * Create a Stripe Checkout session
 * This would be called from an API route in production
 */
export async function createCheckoutSession(
  priceId: string,
  userId: string,
  successUrl: string,
  cancelUrl: string
): Promise<{ sessionId: string; url: string }> {
  // In production, this would call your API endpoint which uses the Stripe SDK:
  //
  // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  // const session = await stripe.checkout.sessions.create({
  //   mode: 'subscription',
  //   payment_method_types: ['card'],
  //   line_items: [{ price: priceId, quantity: 1 }],
  //   success_url: successUrl,
  //   cancel_url: cancelUrl,
  //   client_reference_id: userId,
  //   metadata: { userId },
  // });
  // return { sessionId: session.id, url: session.url };
  
  // Demo implementation
  return {
    sessionId: 'demo_session_' + Date.now(),
    url: successUrl,
  };
}

/**
 * Create a Stripe Customer Portal session
 * Allows users to manage their subscription
 */
export async function createPortalSession(
  customerId: string,
  returnUrl: string
): Promise<{ url: string }> {
  // In production:
  //
  // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  // const session = await stripe.billingPortal.sessions.create({
  //   customer: customerId,
  //   return_url: returnUrl,
  // });
  // return { url: session.url };
  
  return { url: returnUrl };
}

/**
 * Webhook handler for Stripe events
 * This would be in an API route: /api/webhooks/stripe
 */
export function handleStripeWebhook(event: any): { success: boolean; message: string } {
  // In production, verify the webhook signature:
  //
  // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  // const sig = request.headers['stripe-signature'];
  // const event = stripe.webhooks.constructEvent(
  //   request.body,
  //   sig,
  //   process.env.STRIPE_WEBHOOK_SECRET
  // );
  
  switch (event.type) {
    case 'checkout.session.completed':
      // User completed checkout - activate their subscription
      // const userId = event.data.object.client_reference_id;
      // await activateSubscription(userId);
      return { success: true, message: 'Subscription activated' };
      
    case 'customer.subscription.updated':
      // Subscription was updated (upgraded, downgraded, etc.)
      return { success: true, message: 'Subscription updated' };
      
    case 'customer.subscription.deleted':
      // Subscription was cancelled
      // const customerId = event.data.object.customer;
      // await deactivateSubscription(customerId);
      return { success: true, message: 'Subscription cancelled' };
      
    case 'invoice.payment_failed':
      // Payment failed - notify user
      return { success: true, message: 'Payment failed notification sent' };
      
    default:
      return { success: true, message: 'Unhandled event type' };
  }
}

/**
 * Revenue metrics for business dashboard
 */
export interface RevenueMetrics {
  mrr: number; // Monthly Recurring Revenue
  arr: number; // Annual Recurring Revenue
  activeSubscriptions: number;
  churnRate: number;
  ltv: number; // Lifetime Value
}

export function calculateRevenueMetrics(subscriptions: any[]): RevenueMetrics {
  // This would calculate real metrics from your subscription data
  return {
    mrr: 0,
    arr: 0,
    activeSubscriptions: 0,
    churnRate: 0,
    ltv: 0,
  };
}
