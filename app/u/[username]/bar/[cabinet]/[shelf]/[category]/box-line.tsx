import { ReactNode } from 'react'

import { cn } from '@/app/lib/utils'
import { ExcludeState } from '@/app/u/[username]/specs/_criteria/types'

type Props = {
  children?: ReactNode
  className?: string
  title?: boolean
  stocked?: boolean
  wrap?: boolean
  filterState?: ExcludeState
}

export function BoxLine({
  children,
  className,
  title,
  stocked,
  wrap,
  filterState,
}: Props) {
  return (
    <div
      className={cn(
        'text-accent-muted w-full overflow-x-hidden text-ellipsis whitespace-nowrap font-normal tracking-wide [font-stretch:semi-condensed]',
        title && 'font-semibold [font-stretch:condensed]',
        title &&
          (stocked
            ? 'text-secondary-foreground/80'
            : 'text-muted-foreground/60'),
        !title && !stocked && 'text-muted-foreground/40',
        (filterState === 'include' || filterState === 'exclude') &&
          (stocked ? 'text-background' : 'text-background/50'),
        filterState === 'none' &&
          stocked &&
          (title ? 'text-foreground' : 'text-muted-foreground'),
        wrap && 'whitespace-normal',
        className,
      )}
    >
      {children}
    </div>
  )
}
