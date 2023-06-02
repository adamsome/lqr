import { getStaticData } from '@/lib/get-static-data'
import { getUserData } from '@/lib/get-user-data'
import { parseIngredients } from '@/lib/ingredient/parse-ingredients'
import { Data } from '@/lib/types'

import 'server-only'

export async function getData(): Promise<Data> {
  const [userIngredients, staticData] = await Promise.all([
    getUserData(),
    getStaticData(),
  ])
  const { baseIngredients, ingredients, categoryFilter, specs } = staticData
  const data = parseIngredients(baseIngredients, userIngredients, ingredients)
  return { ...data, categoryFilter, specs }
}
