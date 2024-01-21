import { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type Props = {
  children?: ReactNode
  className?: string
  title?: boolean
  stocked?: boolean
  wrap?: boolean
}

export function BoxLine({ children, className, title, stocked, wrap }: Props) {
  return (
    <div
      className={cn(
        'w-full text-muted-foreground/90 font-normal overflow-x-hidden whitespace-nowrap text-ellipsis',
        title && 'font-semibold',
        title && (stocked ? 'text-primary' : 'text-muted-foreground/60'),
        !title && !stocked && 'text-muted-foreground/40',
        wrap && 'whitespace-normal',
        className,
      )}
    >
      {children}
    </div>
  )
}
