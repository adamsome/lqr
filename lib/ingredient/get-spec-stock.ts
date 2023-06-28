import { curry, sortBy } from 'ramda'

import { HierarchicalFilter } from '@/lib/hierarchical-filter'
import { filterIngredientItems } from '@/lib/ingredient/filter-ingredient-items'
import {
  Ingredient,
  IngredientDef,
  Spec,
  SpecIngredient,
  SpecIngredientStock,
  SpecStock,
} from '@/lib/types'

export const getSpecStock = curry(
  (
    baseIngredientDict: Record<string, IngredientDef>,
    ingredientDict: Record<string, Ingredient>,
    root: HierarchicalFilter,
    spec: Spec
  ): SpecStock => {
    const ingredients = spec.ingredients.map((it) =>
      getSpecIngredientStock(baseIngredientDict, ingredientDict, root, it)
    )
    return {
      count: ingredients.filter((it) => it.stock > 0).length,
      total: ingredients.filter(
        (it) =>
          it.type !== 'custom' &&
          // TODO: Remove once we can stock base ingredients
          it.type !== 'category'
      ).length,
      ingredients,
    }
  }
)

function getSpecIngredientStock(
  baseIngredientDict: Record<string, IngredientDef>,
  ingredientDict: Record<string, Ingredient>,
  root: HierarchicalFilter,
  ingredient: SpecIngredient
): SpecIngredientStock {
  const { bottleID } = ingredient
  const getStock = getBottleStock(ingredientDict)
  if (bottleID) {
    const stock = getStock(bottleID)
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
  if (items.length === 0) {
    return {
      type: 'category',
      stock: baseIngredientDict[ingredient.id]?.stock ?? -1,
    }
  }

  const bottles = sortBy(
    (x) => -x.stock,
    items
      .map(({ id }) => ({ id, stock: getStock(id) }))
      .filter(({ stock }) => stock >= 0)
  )
  return {
    type: 'categoryBottle',
    stock: bottles[0]?.stock ?? -1,
    bottles,
  }
}

const getBottleStock = curry(
  (ingredientDict: Record<string, Ingredient>, bottleID: string): number =>
    ingredientDict[bottleID]?.stock ?? -1
)
