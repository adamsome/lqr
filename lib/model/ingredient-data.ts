import { auth } from '@clerk/nextjs'
import { OptionalUnlessRequiredId } from 'mongodb'

import { parseIngredients } from '@/lib/ingredient/parse-ingredients'
import { getStaticData } from '@/lib/model/static-data'
import { FIND_NO_ID, connectToDatabase } from '@/lib/mongodb'
import { Ingredient, IngredientData, User } from '@/lib/types'

import { cache } from 'react'
import invariant from 'tiny-invariant'

import { getUser } from '@/lib/model/user'

import 'server-only'

const getUserIngredients = cache(
  async (userID?: string): Promise<Record<string, Partial<Ingredient>>> => {
    const { userId: currentUserID } = auth()

    const id = userID ?? currentUserID

    if (!id) return {}

    const { db } = await connectToDatabase()
    const user = await db
      .collection<OptionalUnlessRequiredId<User>>('user')
      .findOne({ id }, FIND_NO_ID)
    return user?.ingredients ?? {}
  },
)

export const getIngredientData = cache(
  async (userID?: string): Promise<IngredientData> => {
    const [userIngredients, staticData] = await Promise.all([
      getUserIngredients(userID),
      getStaticData(),
    ])
    const { baseIngredients, ingredients, tree } = staticData
    const dict = parseIngredients(baseIngredients, userIngredients, ingredients)

    return { dict, tree }
  },
)

export const getUserIngredientData = cache(async (username?: string) => {
  const user = await getUser(username)
  invariant(user, `User not found.`)
  const data = await getIngredientData(user.id)
  return { user, data }
})
