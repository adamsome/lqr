import { Column } from '@tanstack/react-table'
import { ArrowDown, ArrowUp } from 'lucide-react'

import { cn } from '@/lib/utils'

type Props<TData, TValue> = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode
  column: Column<TData, TValue>
  right?: boolean
}

export function DataTableColumnHeader<TData, TValue>({
  children,
  className,
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
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    >
      {children}
      {column.getIsSorted() === 'desc' ? (
        <ArrowDown className="h-4 w-4" />
      ) : column.getIsSorted() === 'asc' ? (
        <ArrowUp className="h-4 w-4" />
      ) : (
        <div className="h-4 w-4" />
      )}
    </div>
  )
}
