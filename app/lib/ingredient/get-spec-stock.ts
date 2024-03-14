import { complement, curry, sortBy } from 'ramda'

import { HierarchicalFilter } from '@/app/lib/hierarchical-filter'
import { filterIngredientItems } from '@/app/lib/ingredient/filter-ingredient-items'
import { isSpecIngredientStockIgnorable } from '@/app/lib/ingredient/spec-ingredient-stock'
import {
  Ingredient,
  Spec,
  SpecIngredient,
  SpecIngredientStock,
  SpecStock,
} from '@/app/lib/types'
import { toTruthMap } from '@/app/lib/utils'

const ignoreIngredientIDPrefixes: string[] = [
  'chocolate',
  'flower',
  'leaf',
  'nut',
  'spice',
  'vegetable',
]
const ignoreIngredientIDs = toTruthMap([
  'coffee_bean',
  'extract_vanilla',
  'fruit_cherry',
  'fruit_cucumber',
  'fruit_lemon',
  'fruit_lime',
  'fruit_olive',
  'fruit_orange',
  'fruit_grapefruit',
  'fruit_pineapple',
  'oil_olive',
  'tea_black',
  'water_flat',
])

export const forceOnlyBottleIDs = [
  'liqueur_amaro_aperitivo',
  'liqueur_amaro_light',
  'liqueur_amaro_medium',
  'liqueur_herbal',
  'fortifiedwine_aperitif',
]

export const altBottleGroups: Record<string, string[][]> = {
  liqueur_amaro_aperitivo: [
    ['campari', 'gran_classico_bitter'],
    ['suze', 'salers_gentien_aperitif', 'lofi_gentian_amaro'],
  ],
  liqueur_amaro_medium: [
    ['amaro_ciociaro', 'bigallet_chinachina_amer'],
    ['cappelletti_pasubio_vino_amaro', 'cappelletti_pasubio_vino_amaro'],
  ],
  fortifiedwine_aperitif: [
    ['lillet_blanc', 'cocchi_americano_bianco', 'cap_corse_blanc_quinquina'],
  ],
}

const similar = [
  ['grain_gin_londondry', 'grain_gin_plymouth', 'grain_gin_contemporary'],
  ['brandy_grape_pineaudescharentes', 'brandy_grape_pommeau'],
  ['brandy_grape_cognac', 'brandy_grape_american', 'brandy_grape_armagnac'],
  ['coffee_hot', 'coffee_coldbrew'],
  ['egg_whole', 'egg_white', 'egg_yolk', 'egg_aquafaba'],
  ['cream_heavy', 'milk_whole'],
  ['syrup_simple', 'sugar_brown', 'sugar_white', 'syrup_cane'],
  ['syrup_demerara', 'sugar_demerara', 'syrup_demeraragum', 'syrup_molasses'],
  ['syrup_raspberry', 'syrup_raspberrygum'],
  ['syrup_pineapple', 'syrup_pineapplegum'],
]

export const similarSet = similar.reduce((acc, group) => {
  group.forEach((item) => {
    const others = group.filter((it) => it !== item)
    acc.set(item, others)
  })
  return acc
}, new Map<string, string[]>())

export const getSpecStock = curry(
  (
    dict: Record<string, Ingredient>,
    tree: HierarchicalFilter,
    spec: Spec,
  ): SpecStock => {
    const ingredients = spec.ingredients.map((it) =>
      getSpecIngredientStock(dict, tree, it),
    )
    return {
      count: ingredients.filter((it) => it.stock > 0).length,
      total: ingredients.filter(complement(isSpecIngredientStockIgnorable))
        .length,
      ingredients,
    }
  },
)

function getSpecIngredientStock(
  dict: Record<string, Ingredient>,
  tree: HierarchicalFilter,
  ingredient: SpecIngredient,
): SpecIngredientStock {
  const { id, bottleID } = ingredient
  const _getStock = getStock(dict)
  if (bottleID) {
    const stock = _getStock(bottleID)
    if (stock > 0) {
      return {
        type: 'bottle',
        stock,
        bottles: [{ id: bottleID, stock }],
      }
    }
    if (id && forceOnlyBottleIDs.includes(id)) {
      // Handle checking for alt bottles that can be substituted
      if (altBottleGroups[id]) {
        const group = altBottleGroups[id].find((bottles) =>
          bottles.includes(bottleID),
        )
        if (group) {
          const bottles = group.filter((g) => _getStock(g) > 0)
          if (bottles.length > 0) {
            const sortedBottles = sortBy(
              (x) => -x.stock,
              bottles.map((id) => ({ id, stock: _getStock(id) })),
            )
            return {
              type: 'category',
              stock: sortedBottles[0].stock,
              bottles: sortedBottles,
            }
          }
        }
      }
      return {
        type: 'bottle',
        stock,
        bottles: [{ id: bottleID, stock }],
      }
    }
  }

  if (!id) return { type: 'custom', stock: 0 }

  const include = [ingredient]
  if (similarSet.has(id)) {
    include.push(...similarSet.get(id)!.map((id) => ({ id })))
  }
  const items = filterIngredientItems({ dict, tree }, { include })
  const sortedItems = sortBy(
    (x) => -x.stock,
    items
      .map(({ id }) => ({ id, stock: _getStock(id) }))
      .filter(({ stock }) => stock >= 0),
  )

  const result = {
    type: 'category' as const,
    stock: sortedItems[0]?.stock ?? -1,
    bottles: sortedItems,
  }

  if (result.stock <= 0 && shouldIgnoreIngredient(id)) {
    return { type: 'ignore', stock: 0 }
  }

  return result
}

export const shouldIgnoreIngredient = (id: string) =>
  ignoreIngredientIDs[id] ||
  ignoreIngredientIDPrefixes.some((prefix) => id.startsWith(prefix))

const getStock = curry(
  (dict: Record<string, Ingredient>, id: string): number =>
    dict[id]?.stock ?? -1,
)
