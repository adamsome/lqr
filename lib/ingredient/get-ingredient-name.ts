import { curry } from 'ramda'

import {
  AGING_DICT,
  CATEGORY_DICT,
  Category,
  PRODUCTION_METHOD_DICT,
} from '@/lib/generated-consts'
import { getIngredientDefs } from '@/lib/ingredient/get-ingredient-defs'
import { Ingredient, SpecIngredient } from '@/lib/types'

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
  coffee_bean: true,
  egg_white: true,
  egg_yolk: true,
}

const idMap: Record<string, string> = {
  egg_white: 'Egg Whites',
  syrup_tonic: 'Tonic Water',
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

function getDefaultIngredientName(ingredient: SpecIngredient | Ingredient) {
  return ingredient.name ?? 'Unknown Ingredient'
}

type Options = {
  inclBottle?: boolean
  inclCategory?: boolean
}

export const getIngredientName = curry(
  (
    baseIngredientDict: Record<string, Ingredient>,
    ingredientDict: Record<string, Ingredient>,
    ingredient: SpecIngredient | Ingredient,
    { inclBottle, inclCategory }: Options = {}
  ): string => {
    const { bottleID } = ingredient as SpecIngredient
    if (inclBottle && bottleID) {
      if (ingredientDict[bottleID]) {
        return ingredientDict[bottleID].name
      }
    }
    const { id } = ingredient

    if (!id) {
      return getDefaultIngredientName(ingredient)
    }

    if (idMap[id]) {
      return idMap[id]
    }

    const allDefs = getIngredientDefs(baseIngredientDict, id)
    if (!allDefs?.length) {
      if (inclCategory) {
        const category = CATEGORY_DICT[id as Category]
        if (category) return category.name
      }
      return getDefaultIngredientName(ingredient)
    }

    const [category, ...defs] = allDefs
    const [def1] = defs

    let nameParts = allDefs.map((def) => def.name)
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
        return 'Blackstrap Rum'
      }
      if (id === 'cane_rum_agricole' && productionMethod !== 'coffey') {
        if (productionMethod === 'pot') {
          if (aging?.includes('medium') || aging?.includes('long')) {
            return 'Cane Pot Still Aged Agricole Rum'
          }
          if (aging?.includes('none')) {
            return 'Cane Pot Still Unaged Agricole Rum'
          }
        } else {
          if (aging?.includes('medium') || aging?.includes('long')) {
            return 'Rhum Agricole Vieux'
          }
          if (aging?.includes('none')) {
            return 'Rhum Agricole Blanc'
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
      name = `${prefixes.join(' ')} ${name}`
    }

    return name
  }
)
