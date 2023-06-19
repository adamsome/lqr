import { HierarchicalFilter } from '@/lib/hierarchical-filter'
import { getIngredientDefs } from '@/lib/ingredient/get-ingredient-defs'
import {
  Ingredient,
  IngredientDef,
  Spec,
  SpecIngredient,
  SpecIngredientStock,
  SpecStock,
} from '@/lib/types'
import { curry, sortBy } from 'ramda'

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
    // TODO: Remove once bitters are in
    if (bottleID === 'angostura' || bottleID === 'peychauds') {
      return { type: 'bottle', stock: 1 }
    }
    const stock = getStock(bottleID)
    // TODO: If no exact bottle match, check if in-stock bottles of category
    return {
      type: 'bottle',
      stock,
      bottles: [{ id: bottleID, stock }],
    }
  }

  if (!ingredient.id) return { type: 'custom', stock: 0 }

  const bottleIDs = getBottleIDs(
    baseIngredientDict,
    ingredientDict,
    root,
    ingredient
  )
  if (bottleIDs.length === 0) {
    return {
      type: 'category',
      stock: baseIngredientDict[ingredient.id]?.stock ?? -1,
    }
  }

  const bottles = sortBy(
    (x) => -x.stock,
    bottleIDs
      .map((id) => ({ id, stock: getStock(id) }))
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

function getBottleIDs(
  baseIngredientDict: Record<string, IngredientDef>,
  ingredientDict: Record<string, Ingredient>,
  root: HierarchicalFilter,
  ingredient: SpecIngredient
): string[] {
  if (!ingredient?.id) return []
  const defs = getIngredientDefs(baseIngredientDict, ingredient.id)
  if (!defs?.length) return []
  const node = defs.reduce<HierarchicalFilter | undefined>(
    (acc, def) => acc?.children[def.id],
    root
  )
  const isMethod = isBottleIngredientMethod(ingredientDict, ingredient)
  return (node?.bottleIDs ?? []).filter(isMethod)
}

const isBottleIngredientMethod = curry(
  (
    ingredientDict: Record<string, Ingredient>,
    ingredient: SpecIngredient,
    bottleID: string
  ) => {
    const bottle = ingredientDict[bottleID]
    if (!bottle) return false

    const { aging, black, overproof, productionMethod } = ingredient

    if (aging !== undefined) {
      if (!bottle.aging) return false
      if (!aging.includes(bottle.aging)) return false
    }
    if (black !== undefined) {
      if (black && bottle.black !== black) return false
      if (bottle.black === true) return false
    }
    if (productionMethod !== undefined) {
      if (bottle.productionMethod !== productionMethod) return false
    }
    if (overproof !== undefined) {
      if (overproof && bottle.overproof !== overproof) return false
      if (bottle.overproof === true) return false
    }
    return true
  }
)
