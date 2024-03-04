import { curry, partition } from 'ramda'

import { CATEGORY_DICT, CategoryDef } from '@/app/lib/generated-consts'
import {
  IngredientSuggestion,
  IngredientSuggestionItem,
} from '@/app/lib/suggestions/types'
import type { Ingredient } from '@/app/lib/types'

type CategoryTypeOption = {
  type: CategoryDef['type'] | null
  exclude?: boolean
}

type CriteriaFilters = {
  minCount?: number
  maxCount?: number
  categoryType?: CategoryTypeOption[]
}

export type SuggestionCriteria = CriteriaFilters & {
  sort?: 'exact' | 'total'
  limit?: number
}

function filterCategoryTypes(
  dict: Record<string, Ingredient>,
  items: IngredientSuggestionItem[],
  categoryTypes: CategoryTypeOption[] | undefined,
): unknown {
  if (categoryTypes?.length) {
  }
  if (!items.length || !categoryTypes) return true
  const itemTypes = items.map(
    (it) => CATEGORY_DICT[dict[it.ingredient.id ?? '']?.category]?.type ?? null,
  )
  return categoryTypes.every(({ type, exclude }) =>
    exclude
      ? itemTypes.every((t) => t !== type)
      : itemTypes.some((t) => t === type),
  )
}

const applyCriteriaFilters = curry(
  (
    dict: Record<string, Ingredient>,
    { minCount, maxCount, categoryType }: CriteriaFilters = {},
  ) =>
    (suggestion?: IngredientSuggestion) => {
      if (!suggestion) return false
      if (minCount == null && maxCount == null && !categoryType) return true
      return (
        suggestion.items.length >= (minCount ?? 0) &&
        suggestion.items.length <= (maxCount ?? Number.POSITIVE_INFINITY) &&
        filterCategoryTypes(dict, suggestion.items, categoryType)
      )
    },
)

export const partitionByCriteria = curry(
  (
    dict: Record<string, Ingredient>,
    suggestions: IngredientSuggestion[] = [],
    criteria: CriteriaFilters = {},
  ) =>
    partition<IngredientSuggestion>(
      applyCriteriaFilters(dict, criteria),
      suggestions,
    ),
)

export const applyCriteria = curry(
  (dict: Record<string, Ingredient>) =>
    (
      suggestions: IngredientSuggestion[] = [],
      criteria: SuggestionCriteria = {},
    ) => {
      const { sort, limit } = criteria
      let result = [...suggestions].filter(applyCriteriaFilters(dict, criteria))
      if (sort) {
        result = result.sort((a, b) =>
          sort === 'total'
            ? byTotalCountComparator(a, b)
            : byExactCountComparator(a, b) || byTotalCountComparator(a, b),
        )
      }
      if (limit) result = result.slice(0, limit)
      return result
    },
)

const getTotal = ({ exactCount, subsetCount }: IngredientSuggestion) =>
  exactCount + subsetCount

const byExactCountComparator = (
  a: IngredientSuggestion,
  b: IngredientSuggestion,
) => b.exactCount - a.exactCount

const byTotalCountComparator = (
  a: IngredientSuggestion,
  b: IngredientSuggestion,
) => getTotal(b) - getTotal(a)
