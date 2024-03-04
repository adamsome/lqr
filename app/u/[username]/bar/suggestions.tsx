import { getSpecIngredientSuggestions } from '@/app/lib/suggestions/get-suggestions'
import { getCurrentUser } from '@/app/lib/model/user'
import { getUserSpecs } from '@/app/lib/model/user-specs'
import { IngredientSuggestion } from '@/app/components/ingredient-suggestion'
import { Level } from '@/app/components/layout/level'
import { cn } from '@/app/lib/utils'
import { Stack } from '@/app/components/layout/stack'
import { IngredientSuggestion as Item } from '@/app/lib/suggestions/types'
import { applyCriteria } from '@/app/lib/suggestions/criteria'

type Props = {
  username?: string
}

export async function Suggestions({ username }: Props) {
  const { currentUser, isCurrentUser } = await getCurrentUser(username)
  if (!currentUser || !isCurrentUser) return null

  const { data, specs } = await getUserSpecs(currentUser.id, {
    ingredientsStockUserID: currentUser.id,
  })

  const suggestions = getSpecIngredientSuggestions(data.dict, specs)
  // printTop(data.dict, suggestions)
  const top12 = applyCriteria(data.dict)(suggestions, {
    minCount: 1,
    maxCount: 1,
    sort: 'total',
    limit: 12,
  })
  const rows = top12.reduce(
    ([row1, row2], suggestion, i) =>
      i % 2 === 0
        ? [[...row1, suggestion], row2]
        : [row1, [...row2, suggestion]],
    [[], []] as Item[][],
  )

  return (
    <Stack
      className={cn(
        'no-scrollbar -mx-4 w-auto overflow-auto',
        '[--mask:theme(spacing.4)]',
        '[mask-image:linear-gradient(to_right,transparent,white_var(--mask),white_calc(100%-var(--mask)),transparent)]',
      )}
      items="start"
    >
      {rows.map((its, i) => (
        <Level key={i} className="inline-flex px-4">
          {its.map((it, j) => (
            <IngredientSuggestion key={j} {...it} />
          ))}
        </Level>
      ))}
    </Stack>
  )
}
