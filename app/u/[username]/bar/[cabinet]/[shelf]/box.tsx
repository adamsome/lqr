import { PropsWithChildren, ReactNode } from 'react'

import { cn } from '@/app/lib/utils'
import { BoxLink } from '@/app/u/[username]/bar/components/box'
import { ShelfDef } from '@/app/u/[username]/bar/lib/types'

type Props = {
  children?: ReactNode
  def: ShelfDef
  username?: string
  hideHeading?: boolean
  readonly?: boolean
}

export function Box({ children, username, def, hideHeading, readonly }: Props) {
  const { keys, name, gridCols } = def
  return (
    <BoxLink
      username={username}
      name={name}
      hideHeading={hideHeading}
      hideLink={readonly}
      readonly={readonly}
      {...keys}
    >
      <Grid cols={gridCols}>{children}</Grid>
    </BoxLink>
  )
}

type GridProps = PropsWithChildren<{ cols?: number }>

function Grid({ children, cols }: GridProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-12 gap-x-2 [grid-auto-rows:4px]',
        cols === 1 && 'grid-cols-1',
        cols === 2 && 'grid-cols-2',
        cols === 3 && 'grid-cols-3',
        cols === 4 && 'grid-cols-4',
      )}
    >
      {children}
    </div>
  )
}
