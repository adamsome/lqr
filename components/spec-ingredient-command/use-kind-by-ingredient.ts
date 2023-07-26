import { useMemo } from 'react'

import { useIngredientData } from '@/components/data-provider'
import { HierarchicalFilter } from '@/lib/hierarchical-filter'
import { IngredientKind } from '@/lib/ingredient/kind'
import {
  KIND_INGREDIENT_DICT,
  KIND_MORE_INGREDIENT_TYPES,
} from '@/lib/ingredient/kind-ingredients'
import { SpecIngredient, Usage } from '@/lib/types'

function ingredientHas(ingredient: SpecIngredient, has: SpecIngredient) {
  const keys = Object.keys(has) as (keyof SpecIngredient)[]
  return keys.every((key) => ingredient[key] === has[key])
}

function findKind(
  ingredient: SpecIngredient,
  root: HierarchicalFilter
): [IngredientKind?, boolean?] {
  const kinds = Object.keys(KIND_INGREDIENT_DICT) as IngredientKind[]
  const foundKind = kinds.find((kind) => {
    const ingredients = KIND_INGREDIENT_DICT[kind]
    return ingredients.some((it) => ingredientHas(ingredient, it))
  })
  if (foundKind) return [foundKind]
  if (ingredient.bottleID) return ['spirit', true]
  const found = KIND_MORE_INGREDIENT_TYPES.find(([, defs]) => {
    return defs.some((def) => {
      if (def.id === ingredient.id) return true
      if (def.category) {
        return root.children[def.category]?.childIDs.some(
          (id) => ingredient.id === id
        )
      }
      return false
    })
  })
  return found ? [found[0]] : ['spirit', true]
}

const GARNISH_USAGE: Partial<Record<Usage, boolean>> = {
  grated: true,
  rim: true,
  twist: true,
  wedge: true,
  wheel: true,
}

export function useKindByIngredient(ingredient?: SpecIngredient) {
  const { tree } = useIngredientData()
  return useMemo((): [IngredientKind?, boolean?] => {
    if (!ingredient) return []
    if (ingredient.usage && GARNISH_USAGE[ingredient.usage]) return ['garnish']
    return findKind(ingredient, tree)
  }, [ingredient, tree])
}
