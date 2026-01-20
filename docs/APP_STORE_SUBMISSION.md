# App Store Submission Guide

This guide covers how to submit SplitElite to the Apple App Store and Google Play Store.

## Prerequisites

### Required Accounts
- **Apple Developer Account**: $99/year - [developer.apple.com](https://developer.apple.com)
- **Google Play Console**: $25 one-time - [play.google.com/console](https://play.google.com/console)

### Required Assets
All assets are in `/public/icons/` and `/public/`:
- App icon (SVG, scalable)
- OG image for social sharing
- Favicon

## Option 1: PWABuilder (Recommended)

PWABuilder is the easiest way to package your PWA for app stores.

### Steps:
1. Go to [pwabuilder.com](https://www.pwabuilder.com)
2. Enter your app URL: `https://splitelite.com`
3. PWABuilder will analyze your manifest and service worker
4. Click "Package for stores"
5. Download packages for:
   - **iOS**: Generates Xcode project
   - **Android**: Generates signed APK/AAB

### iOS Submission via PWABuilder:
1. Download the iOS package
2. Open in Xcode
3. Update Bundle ID to: `com.splitelite.app`
4. Configure signing with your Apple Developer certificate
5. Archive and upload to App Store Connect

### Android Submission via PWABuilder:
1. Download the Android package (AAB format)
2. Sign with your keystore
3. Upload to Google Play Console

## Option 2: Capacitor (More Control)

For more customization, use Capacitor to wrap the PWA.

### Setup:
```bash
# Install Capacitor
npm install @capacitor/core @capacitor/cli
npx cap init SplitElite com.splitelite.app

# Add platforms
npm install @capacitor/ios @capacitor/android
npx cap add ios
npx cap add android

# Build web app
npm run build

# Sync to native projects
npx cap sync
```

### iOS Build:
```bash
npx cap open ios
# In Xcode: Product > Archive > Distribute App
```

### Android Build:
```bash
npx cap open android
# In Android Studio: Build > Generate Signed Bundle/APK
```

## App Store Listing Information

### App Name
**SplitElite**

### Subtitle/Short Description
Smart expense splitting for groups and friends

### Full Description
```
SplitElite makes splitting expenses with friends, roommates, and travel companions effortless.

KEY FEATURES:
• Create unlimited expense groups for trips, homes, events, and more
• Track shared expenses with detailed categories
• Smart bill splitting - equal or custom amounts
• See who owes what at a glance
• Minimize payments with optimized settlements
• Multi-currency support (12+ currencies)
• Available in 8 languages

PRO FEATURES:
• Receipt scanning with AI extraction
• Advanced spending analytics
• Export data (CSV, PDF, Excel)
• Recurring expense tracking
• Payment reminders
• Priority support

Whether you're planning a group trip, sharing an apartment, or organizing an event, SplitElite keeps everyone's finances clear and fair.

Download now and never argue about money again!
```

### Keywords
expense splitting, bill splitter, group expenses, money management, splitwise alternative, roommate expenses, travel expenses, shared costs, IOU tracker, debt tracker

### Categories
- **Primary**: Finance
- **Secondary**: Utilities

### Age Rating
4+ (No objectionable content)

### Privacy Policy URL
https://splitelite.com/privacy

### Support URL
https://splitelite.com/help

### Contact Email
customersupport@splitelite.com

## Screenshots Required

### iOS (iPhone)
- 6.7" (iPhone 14 Pro Max): 1290 x 2796 px
- 6.5" (iPhone 14 Plus): 1284 x 2778 px
- 5.5" (iPhone 8 Plus): 1242 x 2208 px

### iOS (iPad)
- 12.9" (iPad Pro): 2048 x 2732 px

### Android
- Phone: 1080 x 1920 px minimum
- Tablet: 1200 x 1920 px minimum

### Recommended Screenshots:
1. Dashboard overview
2. Group expenses list
3. Add expense modal
4. Balance/settlement view
5. Analytics (Pro feature)
6. Settings/language selection

## Review Guidelines Compliance

### Apple App Store
- ✅ No web view wrapper (uses native WKWebView via PWA)
- ✅ Provides value beyond website
- ✅ Works offline
- ✅ Follows Human Interface Guidelines
- ✅ Privacy policy included
- ✅ In-app purchases via App Store (Stripe for web only)

### Google Play Store
- ✅ Meets quality guidelines
- ✅ Privacy policy included
- ✅ Content rating appropriate
- ✅ Target API level compliant
- ✅ Permissions justified

## Post-Submission Checklist

- [ ] Monitor review status
- [ ] Respond to any reviewer questions within 24 hours
- [ ] Prepare marketing materials for launch
- [ ] Set up App Store Optimization (ASO)
- [ ] Configure analytics tracking
- [ ] Plan update schedule

## Estimated Timeline

- **PWABuilder packaging**: 1-2 hours
- **Apple review**: 1-7 days (typically 24-48 hours)
- **Google review**: 1-3 days

## Support

For submission issues, contact:
- Apple: [developer.apple.com/contact](https://developer.apple.com/contact)
- Google: [support.google.com/googleplay/android-developer](https://support.google.com/googleplay/android-developer)
