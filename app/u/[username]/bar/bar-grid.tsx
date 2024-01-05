import { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type Props = {
  children: ReactNode
}

export function BarGrid({ children }: Props) {
  return (
    <div
      className={cn(
        'grid gap-x-4 gap-y-4 lg:gap-x-6 lg:gap-y-8',
        'grid-cols-[repeat(auto-fill,minmax(theme(spacing.64),1fr))]',
      )}
    >
      {children}
    </div>
  )
}
