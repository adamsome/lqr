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
    baseIngredientDict: Record<string, Ingredient>,
    ingredientDict: Record<string, Ingredient>,
    root: HierarchicalFilter,
    spec: Spec
  ): SpecStock => {
    const ingredients = spec.ingredients.map((it) =>
      getSpecIngredientStock(baseIngredientDict, ingredientDict, root, it)
    )
    return {
      count: ingredients.filter((it) => it.stock > 0).length,
      total: ingredients.filter((it) => it.type !== 'custom').length,
      ingredients,
    }
  }
)

function getSpecIngredientStock(
  baseIngredientDict: Record<string, Ingredient>,
  ingredientDict: Record<string, Ingredient>,
  root: HierarchicalFilter,
  ingredient: SpecIngredient
): SpecIngredientStock {
  const { bottleID } = ingredient
  const _getStock = getStock(ingredientDict)
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

  const items = filterIngredientItems(
    { baseIngredientDict, ingredientDict, categoryFilter: root },
    { include: [ingredient] }
  )
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
  (ingredientDict: Record<string, Ingredient>, id: string): number =>
    ingredientDict[id]?.stock ?? -1
)
