import './globals.css'

import { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { Header } from '@/components/header'
import { ThemeProvider } from '@/components/theme-provider'
import { cn } from '@/lib/utils'
import { TailwindIndicator } from '@/components/tailwind-indicator'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'lqr',
  description: 'lqr',
  authors: [
    {
      name: 'adamsome',
      url: 'https://adamso.me',
    },
  ],
  creator: 'adamsome',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  icons: {
    icon: '/favicon.ico',
    shortcut: '/icon.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.webmanifest',
}

type Props = {
  children: React.ReactNode
}

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          inter.className
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <div className="flex-1">{children}</div>
          </div>
          <TailwindIndicator />
        </ThemeProvider>
      </body>
    </html>
  )
}
