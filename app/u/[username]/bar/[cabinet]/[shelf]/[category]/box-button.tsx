'use client'

import { useSelectedLayoutSegments } from 'next/navigation'
import { FormEventHandler } from 'react'

import { useGetIngredientName } from '@/app/lib/ingredient/use-get-ingredient-name'
import { CompProps } from '@/app/lib/types'
import { cn } from '@/app/lib/utils'
import { CategoryKeys } from '@/app/u/[username]/bar/lib/types'

type Props = CompProps & {
  keys: CategoryKeys
  items?: number
  colSpan?: number
  stocked?: boolean
  disabled?: boolean
  onClick?: FormEventHandler<HTMLButtonElement>
}

export function BoxButton({
  children,
  className,
  keys,
  items = 0,
  colSpan,
  stocked,
  disabled,
  onClick,
}: Props) {
  const getIngredientName = useGetIngredientName()
  const selectedPath = useSelectedLayoutSegments()
  const path = [keys.cabinet, keys.shelf, keys.category].filter(Boolean)
  const selected = path.every((key, i) => key === selectedPath[i])

  const rowSpan = 4 * (items + 1) + 4
  return (
    <button
      type="button"
      style={{ gridRow: `span ${rowSpan} / span ${rowSpan}` }}
      className={cn(
        'z-10 flex flex-col px-1.5 py-[3px] my-1 w-full overflow-hidden',
        'text-primary text-xs text-start tracking-tighter',
        'rounded shadow transition-colors',
        'bg-primary/10 border border-primary/7.5',
        !stocked && 'bg-background/25 border-primary/10',
        selected && 'bg-blue-500/25',
        disabled && 'bg-primary/5',
        colSpan === 2 && 'col-span-2',
        colSpan === 3 && 'col-span-3',
        colSpan === 4 && 'col-span-4',
        colSpan === 5 && 'col-span-5',
        colSpan === 6 && 'col-span-6',
        className,
      )}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
