import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2025-12-15.clover' })
  : null;

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  let event: Stripe.Event | any;

  // Production mode - verify webhook signature
  if (stripe && webhookSecret && signature) {
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }
  } else {
    // Demo mode - parse body as JSON
    try {
      event = JSON.parse(body);
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.client_reference_id || session.metadata?.userId;
        
        if (userId) {
          // Update user to premium in database
          // await updateUserSubscription(userId, {
          //   isPremium: true,
          //   stripeCustomerId: session.customer,
          //   subscriptionStatus: 'active',
          // });
          console.log(`User ${userId} upgraded to premium`);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const userId = subscription.metadata?.userId;
        
        if (userId) {
          const status = subscription.status;
          // await updateUserSubscription(userId, {
          //   subscriptionStatus: status,
          //   isPremium: status === 'active',
          //   subscriptionEndDate: new Date(subscription.current_period_end * 1000),
          // });
          console.log(`User ${userId} subscription updated: ${status}`);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const userId = subscription.metadata?.userId;
        
        if (userId) {
          // await updateUserSubscription(userId, {
          //   isPremium: false,
          //   subscriptionStatus: 'cancelled',
          // });
          console.log(`User ${userId} subscription cancelled`);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const customerId = invoice.customer;
        
        // Send email notification about failed payment
        // await sendPaymentFailedEmail(customerId);
        console.log(`Payment failed for customer ${customerId}`);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        // Send receipt email
        console.log(`Payment succeeded for invoice ${invoice.id}`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
