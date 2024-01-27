import { Stack } from '@/app/components/layout/stack'
import { isCurrentUser } from '@/app/lib/model/user'
import { Box as CategoryBox } from '@/app/u/[username]/bar/[cabinet]/[shelf]/[category]/box'
import { Box as ShelfBox } from '@/app/u/[username]/bar/[cabinet]/[shelf]/box'
import { Box as CabinetBox } from '@/app/u/[username]/bar/[cabinet]/box'
import { buildCategories } from '@/app/u/[username]/bar/lib/category-builder'
import {
  getCabinetDef,
  getCategoryDef,
  getShelfDef,
} from '@/app/u/[username]/bar/lib/defs'
import { CABINETS } from '@/app/u/[username]/bar/lib/types'

type Props = {
  username?: string
}

export async function Bar({ username }: Props) {
  const current = await isCurrentUser(username)
  const categories = await buildCategories(username)
  return (
    <Stack gap={4}>
      {CABINETS.map((cabinet) => {
        const cabinetDef = getCabinetDef({ cabinet })
        return (
          <CabinetBox key={cabinet} username={username} def={cabinetDef}>
            {cabinetDef.gridIDs.map((shelf) => {
              const shelfDef = getShelfDef({ cabinet, shelf })
              return (
                <ShelfBox key={shelf} username={username} def={shelfDef}>
                  {shelfDef.gridIDs.map((category) => {
                    const def = getCategoryDef({ cabinet, shelf, category })
                    const barCategory = categories.get(category)
                    if (!barCategory) return null
                    return (
                      <CategoryBox
                        key={category}
                        username={username}
                        def={def}
                        category={barCategory}
                        isCurrentUser={current}
                      />
                    )
                  })}
                </ShelfBox>
              )
            })}
          </CabinetBox>
        )
      })}
    </Stack>
  )
}
