import { Children, Fragment, ReactNode } from 'react'

import { Level } from '@/app/components/layout/level'

type Props = {
  children?: ReactNode
  className?: string
}

export function DotSeparator({ children, className }: Props) {
  return (
    <Level className={className} gap={1.5}>
      {Children.toArray(children).map((child, i) => (
        <Fragment key={i}>
          {i > 0 && <div className="opacity-60">•</div>}
          <div>{child}</div>
        </Fragment>
      ))}
    </Level>
  )
}
