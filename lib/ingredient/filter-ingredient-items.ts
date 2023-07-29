import { curry, uniq } from 'ramda'

import { CATEGORY_DICT, Category } from '@/lib/generated-consts'
import { HierarchicalFilter } from '@/lib/hierarchical-filter'
import { getIngredientDefs } from '@/lib/ingredient/get-ingredient-defs'
import { Ingredient, SpecIngredient } from '@/lib/types'

type IngredientData = {
  dict: Record<string, Ingredient>
  tree: HierarchicalFilter
}

export type IngredientItem = {
  id: string
  path: string[]
}

export type IngredientFilter = {
  include?: (Ingredient | SpecIngredient)[]
  exclude?: (Ingredient | SpecIngredient)[]
  excludeIDs?: string[]
  name?: string
}

export const filterIngredientItems = curry(
  (
    data: IngredientData,
    { include = [], exclude = [] }: IngredientFilter
  ): IngredientItem[] => {
    const getItems = getIngredientItems(data)
    const excludeIDs = new Set(
      uniq(exclude.flatMap((it) => getItems(it).map(({ id }) => id)))
    )
    return uniq(include.flatMap((it) => getItems(it))).filter(
      ({ id }) => !excludeIDs.has(id)
    )
  }
)

const getIngredientItems = curry(
  (
    data: IngredientData,
    ingredient: SpecIngredient | Ingredient
  ): IngredientItem[] => {
    const { dict, tree } = data
    if (!ingredient?.id) return []
    let defs = getIngredientDefs(dict, ingredient.id)
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
      tree
    )
    const isMethod = isBottleIngredientMethod(dict, ingredient)
    return getDescendentItems(path, node).filter(({ id }) => isMethod(id))
  }
)

const getDescendentItems = (
  path: string[],
  tree?: HierarchicalFilter
): IngredientItem[] => {
  if (!tree) return []
  const bottleIDs = tree.bottleIDs ?? []
  const items: IngredientItem[] = [{ id: tree.id, path }]
  items.push(...bottleIDs.map((id) => ({ path, id })))
  for (const childID of tree.childIDs) {
    const node = tree.children[childID]
    items.push(...getDescendentItems([...path, childID], node))
  }
  return items
}

const isBottleIngredientMethod = curry(
  (
    dict: Record<string, Ingredient>,
    ingredient: SpecIngredient | Ingredient,
    bottleID: string
  ) => {
    const bottle = dict[bottleID]
    if (!bottle) return true

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
