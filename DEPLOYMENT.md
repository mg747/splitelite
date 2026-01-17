# SplitElite Deployment Guide

**Domain:** www.intelligenceforall.ai

## 1. Supabase Setup

### Create Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note your project URL and anon key from Settings > API

### Run Database Schema
1. Go to SQL Editor in your Supabase dashboard
2. Copy the contents of `src/lib/supabase/schema.sql`
3. Run the SQL to create all tables and policies

### Configure Auth
1. Go to Authentication > URL Configuration
2. Set Site URL: `https://www.intelligenceforall.ai`
3. Add Redirect URLs:
   - `https://www.intelligenceforall.ai/auth/callback`
   - `https://intelligenceforall.ai/auth/callback`

### Enable Google OAuth (optional)
1. Go to Authentication > Providers > Google
2. Add your Google OAuth credentials
3. Set callback URL in Google Console: `https://YOUR_PROJECT.supabase.co/auth/v1/callback`

---

## 2. Stripe Setup

### Create Products
1. Go to [dashboard.stripe.com/products](https://dashboard.stripe.com/products)
2. Create product "SplitElite Pro"
3. Add two prices:
   - **Monthly:** $4.99/month recurring
   - **Yearly:** $39.99/year recurring (save 33%)
4. Copy the Price IDs (start with `price_`)

### Configure Webhook
1. Go to Developers > Webhooks
2. Add endpoint: `https://www.intelligenceforall.ai/api/stripe/webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
   - `invoice.payment_succeeded`
4. Copy the webhook signing secret (starts with `whsec_`)

### Customer Portal
1. Go to Settings > Billing > Customer portal
2. Enable the portal and configure branding

---

## 3. Resend Setup

### Add Domain
1. Go to [resend.com/domains](https://resend.com/domains)
2. Add domain: `intelligenceforall.ai`
3. Add the DNS records shown to your domain registrar
4. Wait for verification (usually 5-10 minutes)

### Get API Key
1. Go to [resend.com/api-keys](https://resend.com/api-keys)
2. Create a new API key
3. Copy the key (starts with `re_`)

---

## 4. Vercel Deployment

### Connect Repository
1. Push code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your GitHub repository

### Add Environment Variables
In Vercel project settings, add these environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PRICE_MONTHLY=price_xxx
STRIPE_PRICE_YEARLY=price_xxx
RESEND_API_KEY=re_xxx
NEXT_PUBLIC_APP_URL=https://www.intelligenceforall.ai
```

### Configure Domain
1. Go to Project Settings > Domains
2. Add `www.intelligenceforall.ai`
3. Add `intelligenceforall.ai` (redirects to www)
4. Follow DNS instructions to point your domain to Vercel

---

## 5. Post-Deployment Checklist

- [ ] Test sign up flow
- [ ] Test Google OAuth (if enabled)
- [ ] Test creating a group and adding expenses
- [ ] Test Stripe checkout (use test mode first)
- [ ] Verify webhook receives events
- [ ] Test email delivery (payment reminders)
- [ ] Check mobile responsiveness
- [ ] Monitor error logs in Vercel

---

## Environment Variables Summary

| Variable | Source | Example |
|----------|--------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard | `https://abc123.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard | `eyJhbGci...` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe Dashboard | `pk_live_...` |
| `STRIPE_SECRET_KEY` | Stripe Dashboard | `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | Stripe Webhooks | `whsec_...` |
| `STRIPE_PRICE_MONTHLY` | Stripe Products | `price_...` |
| `STRIPE_PRICE_YEARLY` | Stripe Products | `price_...` |
| `RESEND_API_KEY` | Resend Dashboard | `re_...` |
| `NEXT_PUBLIC_APP_URL` | Your domain | `https://www.intelligenceforall.ai` |
