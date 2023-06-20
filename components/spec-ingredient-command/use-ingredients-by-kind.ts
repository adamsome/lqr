import { useMemo } from 'react'

import { useData } from '@/components/data-provider'
import { HierarchicalFilter } from '@/lib/hierarchical-filter'
import { IngredientKind } from '@/lib/ingredient/kind'
import {
  KIND_INGREDIENT_DICT,
  KIND_MORE_INGREDIENT_TYPES,
} from '@/lib/ingredient/kind-ingredients'
import { SpecIngredient } from '@/lib/types'
import { rejectNil } from '@/lib/utils'

function appendKindMoreIngredients(
  categoryFilter: HierarchicalFilter
): Record<IngredientKind, SpecIngredient[]> {
  return KIND_MORE_INGREDIENT_TYPES.reduce(
    (acc, [kind, defs]) => {
      const ingredients = acc[kind]
      const idSet = new Set(rejectNil(ingredients.map((it) => it.id)))
      const moreIngredients = defs.flatMap(({ id, category }) => {
        const ids = categoryFilter.children[category ?? '']?.childIDs ?? []
        if (id) ids.push(id)
        return ids
          .filter((id) => !idSet.has(id))
          .map((id): SpecIngredient => ({ id }))
      })
      return { ...acc, [kind]: [...ingredients, {}, ...moreIngredients] }
    },
    { ...KIND_INGREDIENT_DICT }
  )
}

export function useIngredientsByKind(kind?: IngredientKind) {
  const { categoryFilter } = useData()
  const byKind = useMemo(
    () => appendKindMoreIngredients(categoryFilter),
    [categoryFilter]
  )
  return useMemo(() => (kind ? byKind[kind] : []) ?? [], [byKind, kind])
}
