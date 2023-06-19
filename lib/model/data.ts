import { sortBy } from 'ramda'

import { getSpecStock } from '@/lib/ingredient/get-spec-stock'
import { parseIngredients } from '@/lib/ingredient/parse-ingredients'
import { getSpecs } from '@/lib/model/spec'
import { getStaticData } from '@/lib/model/static-data'
import { getUserIngredients } from '@/lib/model/user'
import { Data } from '@/lib/types'

import 'server-only'

export async function getData(): Promise<Data> {
  const [userIngredients, staticData, rawSpecs] = await Promise.all([
    getUserIngredients(),
    getStaticData(),
    getSpecs(),
  ])
  const { baseIngredients, ingredients, categoryFilter } = staticData
  const data = parseIngredients(baseIngredients, userIngredients, ingredients)

  const getStock = getSpecStock(
    data.baseIngredientDict,
    data.ingredientDict,
    categoryFilter
  )
  const specs = sortBy(
    (s) => (s.stock?.total ?? 0) - (s.stock?.count ?? 0),
    rawSpecs.map((spec) => ({ ...spec, stock: getStock(spec) }))
  )

  return { ...data, categoryFilter, specs }
}
