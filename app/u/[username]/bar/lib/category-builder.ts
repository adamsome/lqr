import { uniq } from 'ramda'
import { cache } from 'react'

import { HierarchicalFilter } from '@/app/lib/hierarchical-filter'
import {
  IngredientItem,
  filterIngredientItems,
} from '@/app/lib/ingredient/filter-ingredient-items'
import { getIngredientName } from '@/app/lib/ingredient/get-ingredient-name'
import { INGREDIENT_KINDS } from '@/app/lib/ingredient/kind'
import {
  KIND_INGREDIENT_DICT,
  KIND_MORE_INGREDIENT_TYPES,
} from '@/app/lib/ingredient/kind-ingredients'
import { getIngredientData } from '@/app/lib/model/ingredient-data'
import { getUser } from '@/app/lib/model/user'
import { IngredientData } from '@/app/lib/types'
import { rejectNil } from '@/app/lib/utils'
import {
  getCabinetDef,
  getCategoryDef,
  getShelfDef,
} from '@/app/u/[username]/bar/lib/defs'
import {
  BarCategory,
  BarListCategoryDef,
  CABINETS,
  CategoryKeys,
} from '@/app/u/[username]/bar/lib/types'

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

export const createCategoryBuilder = (
  data: IngredientData,
  allowRepeats = true,
) => {
  const { dict, tree } = data
  const getItems = filterIngredientItems({ dict, tree })
  const getName = getIngredientName(dict)

  const unused = new Set<string>(
    Object.keys(dict).filter((id) => (dict[id].stock ?? -1) >= 0),
  )
  const used = new Set<string>()

  const build = (def: BarListCategoryDef): BarCategory => {
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
        KIND_MORE_INGREDIENT_TYPES.find(([moreKind]) => moreKind === kind) ?? []
      include.push(...moreIngredients.map(({ category: id }) => ({ id })))
    }

    const allItems = getItems({ include, exclude }) ?? []
    const items = allItems.filter((it) => !exclIDs.has(it.id))
    const allIDs = topIDs.concat(items.map(({ id }) => id))
    const stockedIDs = allIDs.filter((id) => (dict[id]?.stock ?? -1) >= 0)

    const excludeSet = new Set(stockedIDs)
    const root = createTree(items, excludeSet)
    topIDs = topIDs.filter((id) => !excludeSet.has(id))

    // Remove any that have already been added in previous categories
    const unusedIDs = !allowRepeats
      ? stockedIDs.filter((id) => unused.has(id))
      : stockedIDs
    const stocked = unusedIDs.map((id) => {
      unused.delete(id)
      used.add(id)
      return dict[id]
    })

    const topItems = topIDs.map((id) => {
      const ingredient = dict[id] ?? {}
      const name = getName(ingredient)
      return { ...ingredient, name }
    })

    name =
      name ?? def.name ?? getName(include?.[0] ?? {}, { inclCategory: true })

    return { ...def, stocked, root, topItems, name, allIDs }
  }

  return { build, unused, used }
}

type BarCategoryData = {
  categories: Map<string, BarCategory>
  keysByIngredientID: Map<string, CategoryKeys>
}

export const buildCategoryData = async (data: IngredientData) => {
  const { build } = createCategoryBuilder(data)
  const initialState: BarCategoryData = {
    categories: new Map(),
    keysByIngredientID: new Map(),
  }
  return CABINETS.reduce((cabinetAcc, cabinet) => {
    const cabinetDef = getCabinetDef({ cabinet })
    const shelves = Object.keys(cabinetDef.children)
    return shelves.reduce((shelfAcc, shelf) => {
      const shelfDef = getShelfDef({ cabinet, shelf })
      const categories = Object.keys(shelfDef.children)
      return categories.reduce((categoryAcc, category) => {
        const keys = { cabinet, shelf, category }
        const value = build(getCategoryDef(keys))
        categoryAcc.categories.set(category, value)
        value.allIDs.reduce((acc, id) => {
          if (acc.keysByIngredientID.has(id)) {
            const prevCategory = acc.keysByIngredientID.get(id)?.category
            if (prevCategory !== category) {
              console.warn(
                `Ingredient ${id} already has category '${prevCategory}'; setting to '${category}'`,
              )
            }
          }
          acc.keysByIngredientID.set(id, keys)
          return acc
        }, categoryAcc)
        return categoryAcc
      }, shelfAcc)
    }, cabinetAcc)
  }, initialState)
}

export const buildUserCategoryData = cache(async (username?: string) => {
  const user = await getUser(username)
  const data = await getIngredientData(user?.id)
  return buildCategoryData(data)
})
