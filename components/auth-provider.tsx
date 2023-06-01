import { ClerkProvider } from '@clerk/nextjs'
import { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export function AuthProvider({ children }: Props) {
  return (
    <ClerkProvider
      appearance={{
        layout: {
          logoImageUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/icon-invert.png`,
          showOptionalFields: false,
          socialButtonsPlacement: 'bottom',
        },
        variables: {
          colorBackground: 'hsl(222.2 47.4% 11.2%)',
          colorInputBackground: 'hsl(216 34% 17%)',
          colorAlphaShade: 'hsl(213 31% 91%)',
          colorText: 'hsl(213 31% 91%)',
          colorInputText: 'hsl(213 31% 91%)',
          colorShimmer: 'rgba(255,255,255,0.36)',
          shadowShimmer: '1px 1px 2px rgba(0,0,0,0.36)',
          colorPrimary: 'hsl(210 40% 98%)',
          colorTextOnPrimaryBackground: 'hsl(222.2 47.4% 1.2%)',
        },
        elements: {
          activeDeviceIcon: {
            '--cl-chassis-bottom': '#d2d2d2',
            '--cl-chassis-back': '#e6e6e6',
            '--cl-chassis-screen': '#e6e6e6',
            '--cl-screen': '#111111',
          },
        },
      }}
    >
      {children}
    </ClerkProvider>
  )
}
