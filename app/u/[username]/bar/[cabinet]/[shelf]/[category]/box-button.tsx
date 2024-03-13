'use client'

import { useSelectedLayoutSegments } from 'next/navigation'
import { FormEventHandler } from 'react'

import { CompProps } from '@/app/lib/types'
import { cn } from '@/app/lib/utils'
import { CategoryKeys } from '@/app/u/[username]/bar/lib/types'
import { ExcludeState } from '@/app/u/[username]/specs/_criteria/types'

type Props = CompProps & {
  keys: CategoryKeys
  items?: number
  colSpan?: number
  filterState?: ExcludeState
  stocked?: boolean
  disabled?: boolean
  readonly?: boolean
  onClick?: FormEventHandler<HTMLButtonElement>
}

export function BoxButton({
  children,
  className,
  keys,
  items = 0,
  colSpan,
  filterState,
  stocked,
  disabled,
  readonly,
  onClick,
}: Props) {
  const selectedPath = useSelectedLayoutSegments()
  const path = [keys.cabinet, keys.shelf, keys.category].filter(Boolean)
  const selected = path.every((key, i) => key === selectedPath[i])

  const rowSpan = 4 * (items + 1) + 4
  return (
    <button
      type="button"
      style={{ gridRow: `span ${rowSpan} / span ${rowSpan}` }}
      className={cn(
        'z-10 my-1 flex w-full flex-col overflow-hidden px-1.5 py-[3px]',
        'text-start text-xs tracking-tighter',
        'rounded shadow transition-all',
        'bg-accent border-primary/7.5 border',
        !stocked && 'bg-background/25 border-primary/10',
        selected && 'border-accent-muted brightness-125',
        filterState == 'include' && 'bg-accent-muted',
        filterState == 'exclude' && 'bg-destructive',
        filterState == 'none' && 'bg-muted',
        disabled && 'bg-primary/5',
        colSpan === 2 && 'col-span-2',
        colSpan === 3 && 'col-span-3',
        colSpan === 4 && 'col-span-4',
        colSpan === 5 && 'col-span-5',
        colSpan === 6 && 'col-span-6',
        readonly && 'cursor-default',
        className,
      )}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
