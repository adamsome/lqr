import {
  SuggestionCriteria,
  applyCriteria,
  partitionByCriteria,
} from '@/app/lib/suggestions/criteria'
import { IngredientSuggestion } from '@/app/lib/suggestions/types'
import { Ingredient } from '@/app/lib/types'

export function printTopSuggestions(
  dict: Record<string, Ingredient>,
  suggestions: IngredientSuggestion[],
) {
  const apply = applyCriteria(dict)

  const cExact = apply(suggestions, {
    minCount: 2,
    sort: 'exact',
    limit: 10,
  })

  const c1 = apply(suggestions, { minCount: 1, maxCount: 1 })
  const [c1Pantry, c1Liquor] = partitionByCriteria(dict, c1, {
    categoryType: [{ type: null }],
  })
  const [c1Spirit, c1Other] = partitionByCriteria(dict, c1Liquor, {
    categoryType: [{ type: 'spirit' }],
  })

  console.log('c1Pantry', apply(c1Pantry, asTop8ByTotal).map(print))
  console.log('c1Spirit', apply(c1Spirit, asTop8ByTotal).map(print))
  console.log('c1Other', apply(c1Other, asTop8ByTotal).map(print))
  console.log('cExact', cExact.map(print))
}

const asTop8ByTotal: SuggestionCriteria = { sort: 'total', limit: 8 }
