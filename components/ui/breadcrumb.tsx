import { ArrowLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons'
import { Children, Fragment, HTMLAttributes, ReactNode } from 'react'

import { cn } from '@/lib/utils'

type Props = {
  children: ReactNode
  className?: string
  back?: boolean
  onBackClick?: () => void
}

export function Breadcrumb({ children, className, back, onBackClick }: Props) {
  const items = Children.toArray(children)
  return (
    <div
      className={cn(
        'relative flex items-center overflow-hidden whitespace-nowrap',
        '[&>*:last-child]:cursor-auto [&>*:last-child]:font-medium [&>*:last-child]:text-foreground',
        className
      )}
    >
      {back && (
        <BreadcrumbItem>
          <ArrowLeftIcon
            className={cn('relative left-0.5 top-px mr-3 flex-none')}
            onClick={onBackClick}
          />
        </BreadcrumbItem>
      )}
      {Children.map(items, (child, i) => (
        <Fragment key={i}>
          {i > 0 && (
            <ChevronRightIcon className="relative top-px mx-1 flex-none text-muted-foreground/75" />
          )}
          {child}
        </Fragment>
      ))}
    </div>
  )
}

type ItemProps = {
  children: ReactNode
} & HTMLAttributes<HTMLDivElement>

export function BreadcrumbItem({ children, className, ...props }: ItemProps) {
  if (!children) return null
  return (
    <div
      className={cn(
        'cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap',
        'ring-offset-background transition-colors hover:text-accent-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
