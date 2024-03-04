import { uniq } from 'ramda'

import {
  altBottleGroups,
  forceOnlyBottleIDs,
  similarSet,
} from '@/app/lib/ingredient/get-spec-stock'
import { isSpecIngredientStockIgnorable } from '@/app/lib/ingredient/spec-ingredient-stock'
import {
  IngredientSuggestion,
  IngredientSuggestionItem,
} from '@/app/lib/suggestions/types'
import type { Ingredient, Spec, SpecIngredient } from '@/app/lib/types'
import { getCategoryDef } from '@/app/u/[username]/bar/lib/defs'

export function getSpecIngredientSuggestions(
  dict: Record<string, Ingredient>,
  specs: Spec[],
) {
  const countsByKey: Record<string, IngredientSuggestion> = {}
  specs.forEach((spec) => {
    if (!spec.stock) return

    const isMissing = isSpecIngredientAtIndexMissing(spec)

    const { count, total } = spec.stock
    const left = total - count
    if (left <= 0 || left > 3) return

    const missing = spec.ingredients.filter((_, i) => isMissing(i))
    if (missing.length !== left) {
      console.warn(`Not 2 for ${spec.name}`)
      return
    }

    const categoryMap = missing.reduce((acc, it) => {
      const defID = it.bottleID ?? it.id
      if (!defID) return acc
      const keys = dict[defID]?.categoryKeys
      if (!keys?.category) {
        console.warn(`No category for '${defID}' in ${spec.id}`)
        return acc
      }

      const def = getCategoryDef(keys)
      if (def.miscellaneous) {
        if (!it.id) {
          console.warn(`No category for '${JSON.stringify(it)}'`)
          return acc
        }

        const similarID = getSimilarID(it)
        if (similarID) {
          acc.set(similarID, { id: similarID, ingredient: it })
          return acc
        }

        const altBottleID = getAltBottleID(it)
        if (altBottleID) {
          acc.set(altBottleID, { bottleID: altBottleID, ingredient: it })
          return acc
        }

        acc.set(it.id, { id: it.id, ingredient: it })
        return acc
      }

      acc.set(getCategoryKey(keys), { ...keys, ingredient: it })
      return acc
    }, new Map<string, IngredientSuggestionItem>())

    const key = buildGroupKey([...categoryMap.keys()].sort())

    if (!countsByKey[key]) {
      countsByKey[key] = {
        items: [...categoryMap.values()],
        exactCount: 0,
        subsetCount: 0,
      }
    }
    countsByKey[key].exactCount++
  })

  Object.keys(countsByKey).forEach((key) => {
    const { items } = countsByKey[key]
    const keysPerSubset = getAllCombinations(items.map(getCategoryKey))
    countsByKey[key].subsetCount = keysPerSubset.reduce((acc, keys) => {
      if (keys.length === 0 || keys.length >= items.length) return acc
      const subsetKey = buildGroupKey(keys)
      const subset = countsByKey[subsetKey]
      if (!subset) return acc
      return acc + subset.exactCount
    }, 0)
  })

  return Object.values(countsByKey)
}

const getSimilarID = ({ id }: SpecIngredient) =>
  id && similarSet.has(id) ? similarSet.get(id)![0] : undefined

const getAltBottleID = ({ id, bottleID }: SpecIngredient) =>
  id && bottleID && forceOnlyBottleIDs.includes(id)
    ? altBottleGroups[id]
        ?.find((b) => b.includes(bottleID))
        ?.filter((it) => it !== bottleID)?.[0]
    : undefined

const isSpecIngredientAtIndexMissing = (spec: Spec) => (index: number) => {
  const ingredientStock = spec.stock?.ingredients[index]
  if (!ingredientStock) return false
  return (
    !isSpecIngredientStockIgnorable(ingredientStock) &&
    ingredientStock.stock <= 0
  )
}

const buildGroupKey = (keys: string[]) => uniq(keys).sort().join('___')

function getAllCombinations<T>(items: T[]): T[][] {
  const combos: T[][] = []
  const n = items.length
  // 2^n possible combinations of items
  const totalCombos = 1 << n
  for (let i = 0; i < totalCombos; i++) {
    const combo: T[] = []
    // Check each bit (representing the element)
    for (let j = 0; j < n; j++) {
      // If the j-th bit of i is set, include items[j] in the current combo
      if (i & (1 << j)) combo.push(items[j])
    }
    combos.push(combo)
  }
  return combos
}

const getCategoryKey = ({
  id,
  bottleID,
  cabinet,
  shelf,
  category,
}: Omit<IngredientSuggestionItem, 'ingredient'>) =>
  bottleID ?? id ?? [cabinet, shelf, category].join('__')
