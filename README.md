# SplitElite

**Smart Expense Splitting for Groups and Friends**

SplitElite is a modern expense-splitting application that helps you track shared expenses, split bills fairly, and settle up with friends and groups. Whether you're on a trip, sharing an apartment, or organizing an event, SplitElite makes managing shared finances effortless.

![SplitElite Dashboard](./docs/screenshots/dashboard.png)

## Features

### Core Features (Free)
- **Create Groups** - Organize expenses by trips, homes, events, or any category
- **Track Expenses** - Add expenses with descriptions, amounts, categories, and dates
- **Smart Splitting** - Split bills equally or customize amounts per person
- **Balance Tracking** - See who owes what at a glance
- **Settlement Suggestions** - Minimize the number of payments needed to settle up
- **Multi-Currency** - Support for 12+ currencies (USD, EUR, GBP, JPY, etc.)
- **Multi-Language** - Available in 8 languages (English, Spanish, French, German, Chinese, Japanese, Portuguese, Arabic)

### Pro Features
- **Receipt Scanning** - Snap a photo and auto-extract expense details
- **Advanced Analytics** - Spending insights, trends, and category breakdowns
- **Export Data** - Download expenses as CSV, PDF, or Excel
- **Recurring Expenses** - Auto-add monthly bills and subscriptions
- **Payment Reminders** - Nudge friends who owe you money
- **Unlimited Groups** - Create as many groups as you need
- **Priority Support** - 24/7 support with faster response times

## Getting Started

### Step 1: Create Your Account

When you first open SplitElite, you'll see an onboarding flow:

1. **Welcome screens** explain the key features
2. Enter your **name** and **email** to create an account
3. Or click **"Try Demo Mode"** to explore with sample data

![Onboarding](./docs/screenshots/onboarding.png)

### Step 2: Create a Group

Groups help you organize expenses by context (trip, home, event, etc.):

1. Click the **"+"** button in the sidebar or **"Create Group"**
2. Enter a **group name** (e.g., "Europe Trip 2024")
3. Select a **group type** (Trip, Home, Couple, Event, Work, Other)
4. Add **members** by entering their names and optional emails
5. Click **"Create Group"**

![Create Group](./docs/screenshots/create-group.png)

### Step 3: Add Expenses

Track every shared expense:

1. Select a group from the sidebar
2. Click **"Add Expense"**
3. Fill in the details:
   - **Description** - What was the expense for?
   - **Amount** - How much was spent?
   - **Currency** - Select the currency used
   - **Paid by** - Who paid for this expense?
   - **Category** - Food, Transport, Accommodation, etc.
   - **Date** - When did this expense occur?
   - **Split between** - Select who shares this expense
4. Click **"Add Expense"**

![Add Expense](./docs/screenshots/add-expense.png)

### Step 4: View Balances

See who owes what:

1. Go to the **"Balances"** tab in any group
2. View each member's balance:
   - **Green** = They are owed money
   - **Red** = They owe money
3. See **suggested settlements** to minimize payments

![Balances](./docs/screenshots/balances.png)

### Step 5: Settle Up

Mark debts as paid:

1. In the Balances tab, find the suggested payment
2. Click the **checkmark** to record the settlement
3. The balances will update automatically

### Step 6: Manage Settings

Customize your experience:

1. Click **"Settings"** in the sidebar
2. **General tab**:
   - Change language
   - Change default currency
   - View/manage subscription
3. **Account tab**:
   - View profile
   - Freeze account (temporarily disable)
   - Delete account (permanent)
   - Sign out

![Settings](./docs/screenshots/settings.png)

## Editing and Deleting

### Edit/Delete Groups
1. Open a group
2. Click the **gear icon** (⚙️) next to "Add Expense"
3. Select **"Edit"** to modify group details or members
4. Select **"Delete"** to remove the group (this deletes all expenses)

### Edit/Delete Expenses
1. Hover over any expense in the list
2. Click the **pencil icon** (✏️) to edit
3. Click the **trash icon** (🗑️) to delete

## Mobile App Installation

SplitElite is a Progressive Web App (PWA) that can be installed on your device:

### iOS (iPhone/iPad)
1. Open SplitElite in Safari
2. Tap the **Share** button (square with arrow)
3. Scroll down and tap **"Add to Home Screen"**
4. Tap **"Add"** to confirm

### Android
1. Open SplitElite in Chrome
2. Tap the **menu** (three dots)
3. Tap **"Add to Home Screen"** or **"Install App"**
4. Tap **"Install"** to confirm

### Desktop (Chrome/Edge)
1. Look for the **install icon** in the address bar
2. Click **"Install"**

## Technology Stack

- **Framework**: Next.js 14 (React)
- **Styling**: Tailwind CSS
- **State Management**: Zustand with persistence
- **Internationalization**: Custom i18n with 8 languages
- **PWA**: Service worker with offline support
- **Payments**: Stripe integration (Pro features)

## Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/splitelite.git
cd splitelite

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
npm start
```

### Environment Variables

Create a `.env.local` file:

```env
# Stripe (for Pro features)
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...

# App URL
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms
The app can be deployed to any platform supporting Next.js:
- Netlify
- AWS Amplify
- Railway
- Self-hosted with Docker

## Support

- **Email**: customersupport@splitelite.com
- **Help Center**: [Coming Soon]

## License

MIT License - see [LICENSE](LICENSE) for details.

---

**SplitElite** - Making expense sharing simple and fair.
