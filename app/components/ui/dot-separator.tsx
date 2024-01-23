import { Children, Fragment, ReactNode } from 'react'

import { cn } from '@/app/lib/utils'

type Props = {
  children?: ReactNode
  className?: string
}

export function DotSeparator({ children, className }: Props) {
  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      {Children.toArray(children).map((child, i) => (
        <Fragment key={i}>
          {i > 0 && <div className="opacity-60">•</div>}
          <div>{child}</div>
        </Fragment>
      ))}
    </div>
  )
}
