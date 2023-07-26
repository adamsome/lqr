import { useMemo } from 'react'

import { useIngredientData } from '@/components/data-provider'
import { HierarchicalFilter } from '@/lib/hierarchical-filter'
import { IngredientKind } from '@/lib/ingredient/kind'
import {
  KIND_INGREDIENT_DICT,
  KIND_MORE_INGREDIENT_TYPES,
} from '@/lib/ingredient/kind-ingredients'
import { SpecIngredient } from '@/lib/types'
import { rejectNil } from '@/lib/utils'

function appendKindMoreIngredients(
  tree: HierarchicalFilter
): Record<IngredientKind, SpecIngredient[]> {
  return KIND_MORE_INGREDIENT_TYPES.reduce(
    (acc, [kind, defs]) => {
      const ingredients = acc[kind]
      const idSet = new Set(rejectNil(ingredients.map((it) => it.id)))
      const moreIngredients = defs.flatMap(({ id, category }) => {
        const ids = tree.children[category ?? '']?.childIDs ?? []
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
  const { tree } = useIngredientData()
  const byKind = useMemo(() => appendKindMoreIngredients(tree), [tree])
  return useMemo(() => (kind ? byKind[kind] : []) ?? [], [byKind, kind])
}
