import './globals.css'

import { Metadata, Viewport } from 'next'

import { AppCommand } from '@/app/components/app-command'
import { AuthProvider } from '@/app/components/auth-provider'
import { TailwindIndicator } from '@/app/components/tailwind-indicator'
import { themeEffect } from '@/app/components/theme-effect'
import { Toaster } from '@/app/components/ui/toaster'
import { TooltipProvider } from '@/app/components/ui/tooltip'
import { cn } from '@/app/lib/utils'

export const metadata: Metadata = {
  title: 'lqr',
  description: 'lqr',
  authors: [{ name: 'adamsome', url: 'https://adamso.me' }],
  creator: 'adamsome',
}

export const viewport: Viewport = {
  themeColor: 'transparent',
}

type Props = {
  children: React.ReactNode
}

export default function Layout({ children }: Props) {
  return (
    <AuthProvider>
      <html
        lang="en"
        className={cn(`antialiased font-sans`)}
        suppressHydrationWarning={true}
      >
        <head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, maximum-scale=1"
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `(${themeEffect.toString()})();`,
            }}
          />
        </head>
        <body>
          <TooltipProvider>
            <div className="relative flex min-h-screen flex-col">
              <AppCommand />
              <div className="flex-1 min-w-0 overflow-clip">{children}</div>
            </div>
            <Toaster />
          </TooltipProvider>
          <TailwindIndicator />
        </body>
      </html>
    </AuthProvider>
  )
}
