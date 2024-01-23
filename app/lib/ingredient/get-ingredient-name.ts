import { curry } from 'ramda'

import {
  AGING_DICT,
  CATEGORY_DICT,
  Category,
  PRODUCTION_METHOD_DICT,
} from '@/app/lib/generated-consts'
import { getIngredientDefs } from '@/app/lib/ingredient/get-ingredient-defs'
import { Ingredient, SpecIngredient } from '@/app/lib/types'

const suffixByCategory: Partial<Record<Category, string>> = {
  acid: 'Solution',
}

const omitCategoryAndFirstByID: Record<string, boolean> = {
  brandy_grape_armagnac: true,
  brandy_grape_cognac: true,
  brandy_grape_grappa: true,
  brandy_grape_pineaudescharentes: true,
  brandy_grape_pisco: true,
  grain_whiskey_bourbon: true,
  grain_whiskey_scotch: true,
  liqueur_amaro_fernet: true,
  liqueur_amaro_aperitivo: true,
  grain_gin_genever: true,
  liqueur_orange_bluecuracao: true,
  wine_red_lambrusco: true,
  wine_red_malbec: true,
  wine_red_syrah: true,
  wine_sweet_moscatel: true,
  wine_sweet_sauternes: true,
  wine_white_riesling: true,
}

const omitCategory: Partial<Record<Category, boolean>> = {
  fruit: true,
  nut: true,
  spice: true,
  vegetable: true,
  agave: true,
  cane: true,
  fortifiedwine: true,
  grain: true,
}

const omitCategoryByID: Record<string, boolean> = {
  coffee_coldbrew: true,
  egg_aquafaba: true,
  juice_verjus: true,
  soda_gingerbeer: true,
  syrup_grenadine: true,
  syrup_molasses: true,
  syrup_orgeat: true,
  liqueur_absinthe: true,
  liqueur_amaretto: true,
  liqueur_cherryheering: true,
  liqueur_cremedecacao: true,
  liqueur_cremedecassis: true,
  liqueur_cremedementhe: true,
  liqueur_cremedeviolette: true,
  liqueur_falernum: true,
  liqueur_maraschino: true,
}

const omitCategoryByFirst: Record<string, boolean> = {
  liqueur_amaro: true,
  wine_sake: true,
}

const reverseByCategory: Partial<Record<Category, boolean>> = {
  agave: true,
}

const reverseByID: Record<string, boolean> = {
  egg_white: true,
  egg_yolk: true,
}

const idMap: Record<string, string> = {
  coffee_hot: 'Coffee',
  egg_white: 'Egg Whites',
  soda_tonic: 'Tonic Water',
  spice_bay: 'Bay Leaf',
  flat_water: 'Water',
  brandy_applecider: 'Apple Cider Eau-de-vie',
  brandy_apricot: 'Apricot Eau-de-vie',
  brandy_basil: 'Basil Eau-de-vie',
  brandy_carrot: 'Carrot Eau-de-vie',
  brandy_douglasfir: 'Douglas Fir Eau-de-vie',
  brandy_hazelnut: 'Hazelnut Fir Eau-de-vie',
  brandy_pear: 'Pear Eau-de-vie',
  brandy_raisin: 'Raisin Eau-de-vie',
  liqueur_amaro_aperitivo: 'Bitter Aperitivo',
}

const prependBlackPaths: string[] = ['cane_rum']
const prependProductionMethodPaths: string[] = ['cane_rum']
const prependAgingPaths: string[] = [
  'grain_aquavit',
  'grain_gin',
  'cane_cachaca',
  'cane_rum',
]
const prependOverproofPaths: string[] = ['grain_gin', 'cane_rum']

const preserve: Record<string, true> = {
  IPA: true,
}

function getDefaultIngredientName(ingredient: SpecIngredient | Ingredient) {
  return ingredient.name ?? 'Unknown Ingredient'
}

function format(str: string, toLower?: boolean) {
  return toLower ? str.toLocaleLowerCase() : str
}

function formatPreserve(str: string, toLower?: boolean) {
  if (toLower && preserve[str]) return str
  return format(str, toLower)
}

export type Options = {
  inclBottle?: boolean
  inclCategory?: boolean
  toLower?: boolean
}

export const getIngredientName = curry(
  (
    dict: Record<string, Ingredient>,
    ingredient: SpecIngredient | Ingredient,
    { inclBottle, inclCategory, toLower }: Options = {},
  ): string => {
    const { id } = ingredient

    if (inclBottle) {
      const { bottleID } = ingredient as SpecIngredient
      if (bottleID) {
        if (dict[bottleID]) {
          return dict[bottleID].name
        }
      }
      const { ordinal } = ingredient as Ingredient
      if (ordinal !== undefined && id && dict[id]) {
        return dict[id].name
      }
    }

    if (!id) {
      return format(getDefaultIngredientName(ingredient), toLower)
    }

    if (idMap[id]) {
      return format(idMap[id], toLower)
    }

    const allDefs = getIngredientDefs(dict, id)
    if (!allDefs?.length) {
      if (inclCategory) {
        const category = CATEGORY_DICT[id as Category]
        if (category) return category.name
      }
      return format(getDefaultIngredientName(ingredient), toLower)
    }

    const [category, ...defs] = allDefs
    const [def1] = defs

    let nameParts = allDefs.map((def) => formatPreserve(def.name, toLower))
    if (omitCategoryAndFirstByID[id]) {
      nameParts = nameParts.slice(2)
    } else if (
      omitCategory[category.id] ||
      omitCategoryByID[id] ||
      omitCategoryByFirst[def1.id]
    ) {
      nameParts = nameParts.slice(1)
    }

    if (!reverseByCategory[category.id] && !reverseByID[id]) {
      nameParts.reverse()
    }

    let name = nameParts.join(' ')

    const suffix = suffixByCategory[category.id]
    if (suffix) {
      name += ` ${suffix}`
    }

    const {
      black,
      productionMethod,
      aging: rawAging = [],
      overproof,
    } = ingredient

    const aging = Array.isArray(rawAging) ? rawAging : [rawAging]
    const path = def1.id

    // Handle special naming of Blackstrap and AOC Agricole rums
    if (path === 'cane_rum') {
      if (
        path === 'cane_rum' &&
        black &&
        productionMethod === 'blended' &&
        aging?.includes('light')
      ) {
        return format('Blackstrap Rum', toLower)
      }
      if (id === 'cane_rum_agricole' && productionMethod !== 'coffey') {
        if (productionMethod === 'pot') {
          if (aging?.includes('medium') || aging?.includes('long')) {
            return format('Cane Pot Still Aged Agricole Rum', toLower)
          }
          if (aging?.includes('none')) {
            return format('Cane Pot Still Unaged Agricole Rum', toLower)
          }
        } else {
          if (aging?.includes('medium') || aging?.includes('long')) {
            return format('Rhum Agricole Vieux', toLower)
          }
          if (aging?.includes('none')) {
            return format('Rhum Agricole Blanc', toLower)
          }
        }
      }
    }

    // Handle style prefixes
    let prefixes: string[] = []
    if (prependBlackPaths.includes(path)) {
      if (black) {
        prefixes.push('Black')
      }
    }
    if (prependProductionMethodPaths.includes(path)) {
      if (productionMethod) {
        prefixes.push(PRODUCTION_METHOD_DICT[productionMethod].name)
      }
    }
    if (prependAgingPaths.includes(path)) {
      if (aging.length) {
        const mid = aging[Math.floor((aging.length - 1) / 2)]
        prefixes.push(AGING_DICT[mid].name)
      }
    }
    if (prependOverproofPaths.includes(path)) {
      if (overproof) {
        prefixes.push('Overproof')
      }
    }

    if (prefixes.length) {
      name = `${format(prefixes.join(' '), toLower)} ${name}`
    }

    return name
  },
)
