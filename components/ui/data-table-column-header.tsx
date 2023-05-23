import { Column } from '@tanstack/react-table'
import { ArrowDown, ArrowUp } from 'lucide-react'
import { HTMLAttributes, ReactNode } from 'react'

import { cn } from '@/lib/util/cn'

type Props<TData, TValue> = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
  filter?: ReactNode
  column: Column<TData, TValue>
  right?: boolean
}

export function DataTableColumnHeader<TData, TValue>({
  children,
  className,
  filter,
  column,
  right,
}: Props<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{children}</div>
  }

  return (
    <div
      className={cn('flex cursor-pointer items-center gap-1', {
        'justify-end': right,
      })}
    >
      <div
        className="flex cursor-pointer items-center gap-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        {children}
        {column.getIsSorted() === 'desc' ? (
          <ArrowDown className="h-4 w-4" />
        ) : column.getIsSorted() === 'asc' ? (
          <ArrowUp className="h-4 w-4" />
        ) : null}
      </div>
      {filter}
    </div>
  )
}
