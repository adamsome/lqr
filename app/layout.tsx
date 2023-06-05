import './globals.css'

import { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { AuthProvider } from '@/components/auth-provider'
import { Header } from '@/components/header'
import { TailwindIndicator } from '@/components/tailwind-indicator'
import { ThemeProvider } from '@/components/theme-provider'
import { TooltipProvider } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

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

export default function Layout({ children }: Props) {
  return (
    <AuthProvider>
      <html lang="en">
        <body
          className={cn(
            'min-h-screen bg-background font-sans antialiased',
            inter.className
          )}
        >
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <TooltipProvider>
              <div className="relative flex min-h-screen flex-col">
                <Header />
                <div className="flex-1">{children}</div>
              </div>
            </TooltipProvider>
            <TailwindIndicator />
          </ThemeProvider>
        </body>
      </html>
    </AuthProvider>
  )
}
