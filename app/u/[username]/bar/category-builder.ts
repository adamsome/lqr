import { uniq } from 'ramda'

import { BarCategory, BarCategoryDef } from '@/app/u/[username]/bar/types'
import { HierarchicalFilter } from '@/lib/hierarchical-filter'
import {
  IngredientItem,
  filterIngredientItems,
} from '@/lib/ingredient/filter-ingredient-items'
import { getIngredientName } from '@/lib/ingredient/get-ingredient-name'
import { INGREDIENT_KINDS } from '@/lib/ingredient/kind'
import {
  KIND_INGREDIENT_DICT,
  KIND_MORE_INGREDIENT_TYPES,
} from '@/lib/ingredient/kind-ingredients'
import { IngredientData } from '@/lib/types'
import { rejectNil } from '@/lib/utils'

function createTree(
  items: IngredientItem[],
  excl?: Set<string>,
): HierarchicalFilter {
  const root: HierarchicalFilter = {
    id: 'all',
    checked: false,
    childIDs: [],
    children: {},
  }
  for (const { id: ingredientID, path } of items) {
    let node = root
    for (const id of path) {
      if (!node.children[id]) {
        node.childIDs.push(id)
        const checked = excl?.has(id) ?? false
        node.children[id] = { id, checked, childIDs: [], children: {} }
      }
      node = node.children[id]
    }
    if (node.id !== ingredientID && !excl?.has(ingredientID)) {
      if (!node.bottleIDs) node.bottleIDs = []
      node.bottleIDs.push(ingredientID)
    }
  }
  return root
}

export const createCategoryBuilder = (data: IngredientData) => {
  const { dict, tree } = data
  const getItems = filterIngredientItems({ dict, tree })
  const getName = getIngredientName(dict)

  return (allStocked: Set<string>) =>
    (def: BarCategoryDef): BarCategory => {
      const { include: incl, exclude, ids = [], kind, excludeIDs } = def
      const include = incl ?? []
      const exclIDs = new Set(excludeIDs ?? [])
      let name: string | undefined
      let topIDs = ids

      if (kind) {
        name = INGREDIENT_KINDS.find(({ value }) => value === kind)?.label
        const kindItems = KIND_INGREDIENT_DICT[kind] ?? []
        const kindIDs = kindItems.map(({ id, bottleID }) => bottleID ?? id)
        topIDs.push(...uniq(rejectNil(kindIDs)))
        topIDs.forEach((id) => exclIDs.add(id))
        const [, moreIngredients = []] =
          KIND_MORE_INGREDIENT_TYPES.find(([moreKind]) => moreKind === kind) ??
          []
        include.push(...moreIngredients.map(({ category: id }) => ({ id })))
      }

      const allItems = getItems({ include, exclude }) ?? []
      const items = allItems.filter((it) => !exclIDs.has(it.id))
      const stockedIDs = topIDs
        .concat(items.map(({ id }) => id))
        .filter((id) => (dict[id]?.stock ?? -1) >= 0)

      const excludeSet = new Set(stockedIDs)
      const root = createTree(items, excludeSet)
      topIDs = topIDs.filter((id) => !excludeSet.has(id))

      const stocked = stockedIDs
        // Remove any that have already been added in previous categories
        .filter((id) => allStocked.has(id))
        .map((id) => dict[id])
      stockedIDs.forEach((id) => {
        allStocked.delete(id)
      })

      const topItems = topIDs.map((id) => {
        const ingredient = dict[id] ?? {}
        const name = getName(ingredient)
        return { ...ingredient, name }
      })

      name =
        name ?? def.name ?? getName(include?.[0] ?? {}, { inclCategory: true })

      return { ...def, stocked, root, topItems, name }
    }
}
