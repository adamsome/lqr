import { ArrowDownIcon, ArrowUpIcon } from '@radix-ui/react-icons'
import { Column } from '@tanstack/react-table'
import { HTMLAttributes, ReactNode } from 'react'

import { Level } from '@/app/components/layout/level'
import {
  TooltipContent,
  Tooltip as TooltipRoot,
  TooltipTrigger,
} from '@/app/components/ui/tooltip'
import { cn } from '@/app/lib/utils'

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
        <Level
          items="center"
          gap={1}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {children}
          {column.getIsSorted() === 'desc' ? (
            <ArrowDownIcon />
          ) : column.getIsSorted() === 'asc' ? (
            <ArrowUpIcon />
          ) : null}
        </Level>
      </Tooltip>
      {filter}
    </Wrapper>
  )
}

function Wrapper({ children, right }: WrapperProps) {
  return (
    <Level
      className={cn('cursor-pointer', right && 'justify-end')}
      items="center"
    >
      {children}
    </Level>
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
