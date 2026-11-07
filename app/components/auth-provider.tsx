import { ClerkProvider } from '@clerk/nextjs'
import { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export function AuthProvider({ children }: Props) {
  return (
    <ClerkProvider
      appearance={{
        options: {
          logoImageUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/icon-invert.png`,
          showOptionalFields: false,
          socialButtonsPlacement: 'bottom',
        },
        variables: {
          colorBackground: 'hsl(222.2 47.4% 11.2%)',
          colorInput: 'hsl(216 34% 17%)',
          colorNeutral: 'hsl(213 31% 91%)',
          colorForeground: 'hsl(213 31% 91%)',
          colorInputForeground: 'hsl(213 31% 91%)',
          colorShimmer: 'rgba(255,255,255,0.36)',
          colorPrimary: 'hsl(216deg 24% 36%)',
          colorPrimaryForeground: 'hsl(216deg 24% 26%)',
        },
        elements: {
          formButtonPrimary:
            'bg-primary hover:bg-primary/90 focus:bg-primary/80 active:bg-primary/80',
          profileSectionPrimaryButton:
            'text-primary hover:text-primary/90 focus:text-primary/80 active:text-primary/80',
          badge:
            'text-primary hover:text-primary/90 focus:text-primary/80 active:text-primary/80',
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
