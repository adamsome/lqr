import { PropsWithChildren, ReactNode } from 'react'

import { cn } from '@/app/lib/utils'
import { BoxLink } from '@/app/u/[username]/bar/components/box'
import { ShelfDef } from '@/app/u/[username]/bar/lib/types'

type Props = {
  children?: ReactNode
  def: ShelfDef
  username?: string
  hideHeading?: boolean
}

export function Box({ children, username, def, hideHeading }: Props) {
  const { keys, name, gridCols } = def
  return (
    <BoxLink
      username={username}
      name={name}
      hideHeading={hideHeading}
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
        'grid gap-x-2 grid-cols-12 [grid-auto-rows:4px]',
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
