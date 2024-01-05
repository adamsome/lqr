import { auth } from '@clerk/nextjs'

import { BarGrid } from '@/app/u/[username]/bar/bar-grid'
import BarLayout from '@/app/u/[username]/bar/bar-layout'
import { CategorySection } from '@/app/u/[username]/bar/category-section'
import { createCategoryBuilder } from '@/app/u/[username]/bar/category-builder'
import * as DEFS from '@/app/u/[username]/bar/category-defs'
import { Count } from '@/components/ui/count'
import { H1 } from '@/components/ui/h1'
import { H2 } from '@/components/ui/h2'
import { IngredientData, User } from '@/lib/types'

export const revalidate = 0

type Props = {
  user: User
  data: IngredientData
}

export default async function BarContainer({ user, data }: Props) {
  const { dict } = data
  const { userId: currentUserID } = auth()

  const isCurrentUser = user.id == currentUserID

  const stocked = new Set<string>(
    Object.keys(dict).filter((id) => (dict[id].stock ?? -1) >= 0),
  )
  const allStocked = new Set(stocked)
  const count = allStocked.size

  const buildCategory = createCategoryBuilder(data)

  const spiritCategories = DEFS.spirits.map(buildCategory(stocked))
  const ingredientCategories = DEFS.ingredients.map(buildCategory(stocked))

  spiritCategories.push({
    name: 'Other Spirits',
    stocked: Array.from(stocked)
      .map((id) => dict[id])
      .filter((it) => it.ordinal !== undefined),
  })

  return (
    <BarLayout user={user} stocked={allStocked}>
      <div className="flex flex-col gap-4">
        <H1 className="flex items-baseline gap-3">
          Bar <Count className="text-[75%] hidden sm:inline" count={count} />
        </H1>
        <BarGrid>
          {spiritCategories.map((c, i) => (
            <CategorySection
              key={c.name ?? i}
              category={c}
              muteItems
              isCurrentUser={isCurrentUser}
            />
          ))}
        </BarGrid>
      </div>

      <div className="flex flex-col gap-4">
        <H2>Non-alcoholic</H2>
        <BarGrid>
          {ingredientCategories.map((c, i) => (
            <CategorySection
              key={c.name ?? i}
              category={c}
              isCurrentUser={isCurrentUser}
            />
          ))}
        </BarGrid>
      </div>
    </BarLayout>
  )
}
