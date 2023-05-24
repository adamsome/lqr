import { Column } from '@tanstack/react-table'
import { ArrowDown, ArrowUp } from 'lucide-react'
import { HTMLAttributes, ReactNode } from 'react'

import {
  TooltipContent,
  Tooltip as TooltipRoot,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

type WrapperProps = {
  children: ReactNode
  right?: boolean
}

type TooltipProps = {
  children: ReactNode
  tooltip?: ReactNode
}

type Props<TData, TValue> = HTMLAttributes<HTMLDivElement> &
  WrapperProps &
  TooltipProps & {
    filter?: ReactNode
    column: Column<TData, TValue>
  }

export function DataTableColumnHeader<TData, TValue>({
  children,
  className,
  filter,
  column,
  tooltip,
  right,
}: Props<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{children}</div>
  }

  return (
    <Wrapper right={right}>
      <Tooltip tooltip={tooltip}>
        <div
          className="flex items-center gap-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {children}
          {column.getIsSorted() === 'desc' ? (
            <ArrowDown className="h-4 w-4" />
          ) : column.getIsSorted() === 'asc' ? (
            <ArrowUp className="h-4 w-4" />
          ) : null}
        </div>
      </Tooltip>
      {filter}
    </Wrapper>
  )
}

function Wrapper({ children, right }: WrapperProps) {
  return (
    <div
      className={cn('flex cursor-pointer items-center gap-2', {
        'justify-end': right,
      })}
    >
      {children}
    </div>
  )
}

export function Tooltip<TData, TValue>({ children, tooltip }: TooltipProps) {
  if (!tooltip) {
    return <>{children}</>
  }
  return (
    <TooltipRoot>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </TooltipRoot>
  )
}
