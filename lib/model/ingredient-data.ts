import { parseIngredients } from '@/lib/ingredient/parse-ingredients'
import { getStaticData } from '@/lib/model/static-data'
import { getUserIngredients } from '@/lib/model/user'
import { IngredientData } from '@/lib/types'

import 'server-only'

export async function getIngredientData(): Promise<IngredientData> {
  const [userIngredients, staticData] = await Promise.all([
    getUserIngredients(),
    getStaticData(),
  ])
  const { baseIngredients, ingredients, tree } = staticData
  const dict = parseIngredients(baseIngredients, userIngredients, ingredients)

  return { dict, tree }
}
