import { curry, uniq } from 'ramda'

import { HierarchicalFilter } from '@/lib/hierarchical-filter'
import { getIngredientDefs } from '@/lib/ingredient/get-ingredient-defs'
import { Ingredient, IngredientDef, SpecIngredient } from '@/lib/types'
import { CATEGORY_DICT, Category } from '@/lib/generated-consts'

type IngredientData = {
  baseIngredientDict: Record<string, IngredientDef>
  ingredientDict: Record<string, Ingredient>
  categoryFilter: HierarchicalFilter
}

export type IngredientItem = {
  id: string
  path: string[]
}

export type IngredientFilter = {
  include?: (Ingredient | SpecIngredient)[]
  exclude?: (Ingredient | SpecIngredient)[]
  items?: IngredientItem[]
  excludeIDs?: string[]
  name?: string
}

export const filterIngredientItems = curry(
  (
    data: IngredientData,
    { include = [], exclude = [] }: IngredientFilter
  ): IngredientItem[] => {
    const getBottleIDs = _getIngredientBottleIDs(data)
    const exclBottleIDs = new Set(
      uniq(exclude.flatMap((it) => getBottleIDs(it).map(({ id }) => id)))
    )
    return uniq(include.flatMap((it) => getBottleIDs(it))).filter(
      ({ id }) => !exclBottleIDs.has(id)
    )
  }
)

const _getIngredientBottleIDs = curry(
  (
    data: IngredientData,
    ingredient: SpecIngredient | IngredientDef
  ): IngredientItem[] => {
    const { baseIngredientDict, ingredientDict, categoryFilter: root } = data
    if (!ingredient?.id) return []
    let defs = getIngredientDefs(baseIngredientDict, ingredient.id)
    if (!defs?.length) {
      const category = CATEGORY_DICT[ingredient.id as Category]
      if (category) {
        defs = [category]
      } else {
        return []
      }
    }
    const path = defs.map((def) => def.id)
    const node = path.reduce<HierarchicalFilter | undefined>(
      (acc, id) => acc?.children[id],
      root
    )
    const isMethod = isBottleIngredientMethod(ingredientDict, ingredient)
    return getDescendentBottleIDs(path, node).filter(({ id }) => isMethod(id))
  }
)

const getDescendentBottleIDs = (
  path: string[],
  root?: HierarchicalFilter
): IngredientItem[] => {
  if (!root) return []
  const bottleIDs = root.bottleIDs ?? []
  const bottles = bottleIDs.map((id) => ({ path, id }))
  for (const childID of root.childIDs) {
    const node = root.children[childID]
    bottles.push(...getDescendentBottleIDs([...path, childID], node))
  }
  return bottles
}

const isBottleIngredientMethod = curry(
  (
    ingredientDict: Record<string, Ingredient>,
    ingredient: SpecIngredient | IngredientDef,
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
      if (black && bottle.black !== true) return false
      if (!black && bottle.black === true) return false
    }
    if (productionMethod !== undefined) {
      if (bottle.productionMethod !== productionMethod) return false
    }
    if (overproof !== undefined) {
      if (overproof && bottle.overproof !== true) return false
      if (!overproof && bottle.overproof === true) return false
    }
    return true
  }
)