import { complement, curry, sortBy } from 'ramda'

import { HierarchicalFilter } from '@/lib/hierarchical-filter'
import { filterIngredientItems } from '@/lib/ingredient/filter-ingredient-items'
import {
  Ingredient,
  Spec,
  SpecIngredient,
  SpecIngredientStock,
  SpecStock,
} from '@/lib/types'
import { Category } from '@/lib/generated-consts'
import { toTruthMap } from '@/lib/utils'
import { isSpecIngredientStockIgnorable } from '@/lib/ingredient/spec-ingredient-stock'

const decorIngredientIDPrefixes: string[] = [
  'chocolate',
  'coffee',
  'flower',
  'leaf',
  'nut',
  'spice',
  'vegetable',
]
const commonIngredientIDs = toTruthMap([
  'coffee_coldbrew',
  'coffee_hot',
  'cream_heavy',
  'egg_white',
  'egg_yolk',
  'egg_whole',
  'extract_vanilla',
  'fruit_lemon',
  'fruit_lime',
  'fruit_olive',
  'fruit_orange',
  'juice_lemon',
  'juice_lime',
  'juice_orange',
  'milk_whole',
  'oil_olive',
  'soda_club',
  'sugar_white',
  'syrup_honey',
  'syrup_maple',
  'syrup_simple',
  'tea_black',
  'water_flat',
])

const ignoreBottleIDs = [
  'liqueur_amaro_aperitivo',
  'liqueur_amaro_light',
  'liqueur_amaro_medium',
  'liqueur_herbal',
  'fortifiedwine_aperitif',
]

const altBottleGroups: Record<string, string[][]> = {
  liqueur_amaro_aperitivo: [
    ['gran_classico_bitter', 'campari'],
    ['suze', 'salers_gentien_aperitif'],
  ],
  liqueur_amaro_medium: [
    ['amaro_ciociaro', 'bigallet_chinachina_amer'],
    ['cappelletti_pasubio_vino_amaro', 'cappelletti_pasubio_vino_amaro'],
  ],
  fortifiedwine_aperitif: [
    ['cocchi_americano_bianco', 'lillet_blanc', 'cap_corse_blanc_quinquina'],
  ],
}

const similar = [
  ['grain_gin_londondry', 'grain_gin_plymouth', 'grain_gin_contemporary'],
  ['brandy_grape_pommeau', 'brandy_grape_pineaudescharentes'],
  ['brandy_grape_american', 'brandy_grape_cognac', 'brandy_grape_armagnac'],
  [
    'sugar_brown',
    'sugar_demerara',
    'sugar_white',
    'syrup_cane',
    'syrup_demerara',
    'syrup_demeraragum',
    'syrup_maple',
    'syrup_molasses',
    'syrup_simple',
  ],
  ['syrup_raspberrygum', 'syrup_raspberry'],
  ['syrup_pineapplegum', 'syrup_pineapple'],
]

const similarSet = similar.reduce((acc, group) => {
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
    if (stock > 0 || (id && ignoreBottleIDs.includes(id))) {
      // Handle checking for alt bottles that can be substituted
      if (stock <= 0 && id && altBottleGroups[id]) {
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

  if (
    result.stock <= 0 &&
    (commonIngredientIDs[id] ||
      decorIngredientIDPrefixes.some((prefix) => id.startsWith(prefix)))
  ) {
    return { type: 'ignore', stock: 0 }
  }

  return result
}

const getStock = curry(
  (dict: Record<string, Ingredient>, id: string): number =>
    dict[id]?.stock ?? -1,
)
