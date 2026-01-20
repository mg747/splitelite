import type { Metadata, Viewport } from 'next'
import './globals.css'
import TranslationProvider from '@/components/TranslationProvider'
import { AuthProvider } from '@/contexts/AuthContext'
import { DataProvider } from '@/contexts/DataContext'

export const metadata: Metadata = {
  metadataBase: new URL('https://splitelite.com'),
  title: 'SplitElite - Smart Expense Splitting',
  description: 'The premium way to split expenses with friends and groups. Track expenses, split bills, and settle up easily.',
  keywords: ['expense splitting', 'bill splitting', 'group expenses', 'money management', 'splitwise alternative'],
  authors: [{ name: 'SplitElite' }],
  creator: 'SplitElite',
  publisher: 'SplitElite',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'SplitElite',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://splitelite.com',
    siteName: 'SplitElite',
    title: 'SplitElite - Smart Expense Splitting',
    description: 'The premium way to split expenses with friends and groups',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'SplitElite - Smart Expense Splitting',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SplitElite - Smart Expense Splitting',
    description: 'The premium way to split expenses with friends and groups',
    images: ['/og-image.svg'],
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/icons/icon.svg', type: 'image/svg+xml' },
    ],
    other: [
      { rel: 'mask-icon', url: '/icons/icon.svg', color: '#22c55e' },
    ],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#22c55e' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0e17' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* iOS specific meta tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="SplitElite" />
        
        {/* Android specific */}
        <meta name="mobile-web-app-capable" content="yes" />
        
        {/* Microsoft */}
        <meta name="msapplication-TileColor" content="#0a0e17" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* Splash screens for iOS */}
        <link rel="apple-touch-startup-image" href="/splash/apple-splash-2048-2732.png" media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)" />
        <link rel="apple-touch-startup-image" href="/splash/apple-splash-1668-2388.png" media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)" />
        <link rel="apple-touch-startup-image" href="/splash/apple-splash-1536-2048.png" media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)" />
        <link rel="apple-touch-startup-image" href="/splash/apple-splash-1125-2436.png" media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)" />
        <link rel="apple-touch-startup-image" href="/splash/apple-splash-1242-2688.png" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)" />
        <link rel="apple-touch-startup-image" href="/splash/apple-splash-750-1334.png" media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)" />
        <link rel="apple-touch-startup-image" href="/splash/apple-splash-1242-2208.png" media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3)" />
      </head>
      <body className="min-h-screen bg-dark-950">
        <AuthProvider>
          <DataProvider>
            <TranslationProvider>
              {children}
            </TranslationProvider>
          </DataProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
