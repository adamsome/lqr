import { auth } from '@clerk/nextjs'
import { OptionalUnlessRequiredId } from 'mongodb'

import { parseIngredients } from '@/lib/ingredient/parse-ingredients'
import { getStaticData } from '@/lib/model/static-data'
import { connectToDatabase } from '@/lib/mongodb'
import { Ingredient, IngredientData, User } from '@/lib/types'

import 'server-only'

async function getUserIngredients(
  userID?: string,
): Promise<Record<string, Partial<Ingredient>>> {
  const { userId: currentUserID } = auth()

  const id = userID ?? currentUserID

  if (!id) return {}

  const { db } = await connectToDatabase()
  const user = await db
    .collection<OptionalUnlessRequiredId<User>>('user')
    .findOne({ id }, { projection: { _id: false } })
  return user?.ingredients ?? {}
}

export async function getIngredientData(
  userID?: string,
): Promise<IngredientData> {
  const [userIngredients, staticData] = await Promise.all([
    getUserIngredients(userID),
    getStaticData(),
  ])
  const { baseIngredients, ingredients, tree } = staticData
  const dict = parseIngredients(baseIngredients, userIngredients, ingredients)

  return { dict, tree }
}
