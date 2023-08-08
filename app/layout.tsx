import './globals.css'

import { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { AuthProvider } from '@/components/auth-provider'
import { Header } from '@/components/header'
import { TailwindIndicator } from '@/components/tailwind-indicator'
import { themeEffect } from '@/components/theme-effect'
import { Toaster } from '@/components/ui/toaster'
import { TooltipProvider } from '@/components/ui/tooltip'

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
  themeColor: 'transparent',
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
      <html
        lang="en"
        className={`${inter.className} antialiased font-sans`}
        suppressHydrationWarning={true}
      >
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: `(${themeEffect.toString()})();`,
            }}
          />
        </head>
        <body className="min-h-screen">
          <TooltipProvider>
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <div className="flex-1">{children}</div>
            </div>
            <Toaster />
          </TooltipProvider>
          <TailwindIndicator />
        </body>
      </html>
    </AuthProvider>
  )
}
