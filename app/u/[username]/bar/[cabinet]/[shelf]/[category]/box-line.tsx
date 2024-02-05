import { ReactNode } from 'react'

import { cn } from '@/app/lib/utils'

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
        'w-full text-accent-muted font-normal [font-stretch:semi-condensed] tracking-wide overflow-x-hidden whitespace-nowrap text-ellipsis',
        title && 'font-semibold [font-stretch:condensed]',
        title &&
          (stocked
            ? 'text-secondary-foreground/80'
            : 'text-muted-foreground/60'),
        !title && !stocked && 'text-muted-foreground/40',
        wrap && 'whitespace-normal',
        className,
      )}
    >
      {children}
    </div>
  )
}
