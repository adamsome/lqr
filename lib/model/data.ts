import { parseIngredients } from '@/lib/ingredient/parse-ingredients'
import { getSpecs } from '@/lib/model/spec'
import { getStaticData } from '@/lib/model/static-data'
import { getUserIngredients } from '@/lib/model/user'
import { Data } from '@/lib/types'

import 'server-only'

export async function getData(): Promise<Data> {
  const [userIngredients, staticData, specs] = await Promise.all([
    getUserIngredients(),
    getStaticData(),
    getSpecs(),
  ])
  const { baseIngredients, ingredients, categoryFilter } = staticData
  const data = parseIngredients(baseIngredients, userIngredients, ingredients)
  return { ...data, categoryFilter, specs }
}
