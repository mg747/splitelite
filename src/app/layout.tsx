import type { Metadata } from 'next'
import './globals.css'
import TranslationProvider from '@/components/TranslationProvider'

export const metadata: Metadata = {
  title: 'SplitElite - Smart Expense Splitting',
  description: 'The premium way to split expenses with friends and groups',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-dark-950">
        <TranslationProvider>
          {children}
        </TranslationProvider>
      </body>
    </html>
  )
}
