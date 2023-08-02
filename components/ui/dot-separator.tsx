import { cn } from '@/lib/utils'
import { Children, ReactNode } from 'react'

type Props = {
  children?: ReactNode
  className?: string
}

export function DotSeparator({ children, className }: Props) {
  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      {Children.toArray(children).map((child, i) => (
        <>
          {i > 0 && <div className="opacity-60">•</div>}
          <div>{child}</div>
        </>
      ))}
    </div>
  )
}
