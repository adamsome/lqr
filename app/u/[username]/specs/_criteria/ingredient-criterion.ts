import invariant from 'tiny-invariant'

import {
  AGING_DICT,
  Aging,
  PRODUCTION_METHOD_DICT,
  ProductionMethod,
} from '@/lib/generated-consts'
import { SpecIngredient } from '@/lib/types'

type ModifierKeys = 'aging' | 'productionMethod' | 'black' | 'overproof'
const MODIFIERS: Record<keyof Pick<SpecIngredient, ModifierKeys>, string> = {
  aging: 'age',
  productionMethod: 'pm',
  black: 'bk',
  overproof: 'op',
}

const SEP = { MOD: '.', KV: '-' }

export function buildIngredientCriterion(ingredient: SpecIngredient): string {
  const { id, bottleID, aging, productionMethod, black, overproof } = ingredient
  if (bottleID) return bottleID
  let res = id
  invariant(res, `Ingredient filter is empty '${JSON.stringify(ingredient)}'`)
  if (aging) {
    res += `${SEP.MOD}${MODIFIERS.aging}${SEP.KV}${aging.join(SEP.KV)}`
  }
  if (productionMethod) {
    res += `${SEP.MOD}${MODIFIERS.productionMethod}${SEP.KV}${productionMethod}`
  }
  if (black) {
    res += `${SEP.MOD}${MODIFIERS.black}${SEP.KV}${black ? 1 : 0}`
  }
  if (overproof) {
    res += `${SEP.MOD}${MODIFIERS.overproof}${SEP.KV}${overproof ? 1 : 0}`
  }
  return res
}

export function parseIngredientCriterion(
  criterion?: string,
): SpecIngredient | null {
  if (!criterion) return null
  const [id, ...modifiers] = criterion.split(SEP.MOD)
  invariant(id, `No ID in ingredient filter criterion '${criterion}'`)
  return modifiers.reduce<SpecIngredient>(parseModifier, { id })
}

const AGING_VALUES = Object.keys(AGING_DICT) as Aging[]

function isAgingValue(value?: string): value is Aging {
  return AGING_VALUES.includes(value as Aging)
}

const METHOD_VALUES = Object.keys(PRODUCTION_METHOD_DICT) as ProductionMethod[]

function isProductionMethodValue(value?: string): value is ProductionMethod {
  return METHOD_VALUES.includes(value as ProductionMethod)
}

function parseModifier(it: SpecIngredient, modifier: string): SpecIngredient {
  const [key, ...values] = modifier.split(SEP.KV)
  invariant(key, `Empty ingredient filter modifier key '${modifier}'`)
  invariant(
    values.length,
    `Empty ingredient filter modifier values '${modifier}'`,
  )
  switch (key) {
    case MODIFIERS.aging: {
      invariant(
        values.every(isAgingValue),
        `Ingredient filter aging value invalid '${values.join(', ')}'`,
      )
      it.aging = values
      return it
    }
    case MODIFIERS.productionMethod: {
      const value = values[0]
      invariant(
        isProductionMethodValue(value),
        `Ingredient filter production method value invalid '${value}'`,
      )
      it.productionMethod = value
      return it
    }
    case MODIFIERS.black: {
      const value = values[0]
      invariant(
        value === '0' || value === '1',
        `Ingredient filter black value invalid '${value}'`,
      )
      it.black = value === '1'
      return it
    }
    case MODIFIERS.overproof: {
      const value = values[0]
      invariant(
        value === '0' || value === '1',
        `Ingredient filter overproof value invalid '${value}'`,
      )
      it.overproof = value === '1'
      return it
    }
  }
  throw new Error(`Invalid ingredient filter modifier '${key}'`)
}
