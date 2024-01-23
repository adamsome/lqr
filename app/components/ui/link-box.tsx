import NextLink, { LinkProps } from 'next/link'
import { HTMLAttributes, forwardRef } from 'react'

import { cn } from '@/app/lib/utils'

export const LinkBox = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('isolate relative', className)} {...props} />
))
LinkBox.displayName = 'LinkBox'

export const LinkBoxLink = forwardRef<
  HTMLAnchorElement,
  LinkProps & HTMLAttributes<HTMLAnchorElement>
>(({ className, children, ...props }, ref) => (
  <NextLink
    ref={ref}
    className={cn('before:absolute before:inset-0 before:z-0', className)}
    {...props}
  >
    {children}
  </NextLink>
))
LinkBoxLink.displayName = 'LinkBoxLink'

export const LinkBoxButton = forwardRef<
  HTMLButtonElement,
  HTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => (
  <button
    ref={ref}
    className={cn('before:absolute before:inset-0 before:z-0', className)}
    {...props}
  >
    {children}
  </button>
))
LinkBoxButton.displayName = 'LinkBoxButton'
