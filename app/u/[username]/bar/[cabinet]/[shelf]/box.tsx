import { PropsWithChildren } from 'react'

import { buildCategories } from '@/app/u/[username]/bar/lib/category-builder'
import { getCategoryDef } from '@/app/u/[username]/bar/lib/defs'
import { Box as CategoryBox } from '@/app/u/[username]/bar/[cabinet]/[shelf]/[category]/box'
import { BoxLink } from '@/app/u/[username]/bar/components/box'
import { ShelfDef } from '@/app/u/[username]/bar/lib/types'
import { cn } from '@/app/lib/utils'
import { isCurrentUser } from '@/app/lib/model/user'

type Props = ShelfDef & {
  username?: string
}

export async function Box({ username, keys, name, gridIDs, gridCols }: Props) {
  const current = await isCurrentUser(username)
  const categories = await buildCategories(username)
  return (
    <BoxLink username={username} name={name} {...keys}>
      <Grid cols={gridCols}>
        {gridIDs.map((id) => {
          const def = getCategoryDef({ ...keys, category: id })
          const category = categories.get(id)
          if (!category) return null
          return (
            <CategoryBox
              key={id}
              username={username}
              def={def}
              category={category}
              isCurrentUser={current}
            />
          )
        })}
      </Grid>
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
