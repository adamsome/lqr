import { curry, sortBy } from 'ramda'

import { HierarchicalFilter } from '@/lib/hierarchical-filter'
import { filterIngredientItems } from '@/lib/ingredient/filter-ingredient-items'
import {
  Ingredient,
  Spec,
  SpecIngredient,
  SpecIngredientStock,
  SpecStock,
} from '@/lib/types'

export const getSpecStock = curry(
  (
    byID: Record<string, Ingredient>,
    tree: HierarchicalFilter,
    spec: Spec
  ): SpecStock => {
    const ingredients = spec.ingredients.map((it) =>
      getSpecIngredientStock(byID, tree, it)
    )
    return {
      count: ingredients.filter((it) => it.stock > 0).length,
      total: ingredients.filter((it) => it.type !== 'custom').length,
      ingredients,
    }
  }
)

function getSpecIngredientStock(
  byID: Record<string, Ingredient>,
  tree: HierarchicalFilter,
  ingredient: SpecIngredient
): SpecIngredientStock {
  const { bottleID } = ingredient
  const _getStock = getStock(byID)
  if (bottleID) {
    const stock = _getStock(bottleID)
    // TODO: If no exact bottle match, check if in-stock bottles of category
    return {
      type: 'bottle',
      stock,
      bottles: [{ id: bottleID, stock }],
    }
  }

  if (!ingredient.id) return { type: 'custom', stock: 0 }

  const items = filterIngredientItems({ byID, tree }, { include: [ingredient] })
  const sortedItems = sortBy(
    (x) => -x.stock,
    items
      .map(({ id }) => ({ id, stock: _getStock(id) }))
      .filter(({ stock }) => stock >= 0)
  )
  return {
    type: 'category',
    stock: sortedItems[0]?.stock ?? -1,
    bottles: sortedItems,
  }
}

const getStock = curry(
  (byID: Record<string, Ingredient>, id: string): number =>
    byID[id]?.stock ?? -1
)
