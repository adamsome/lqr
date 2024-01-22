import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

export const EmptyList = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-lg text-muted-foreground/50 font-semibold', className)}
    {...props}
  >
    Not following any users
  </div>
))
EmptyList.displayName = 'EmptyList'
