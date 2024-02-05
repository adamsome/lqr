import { auth } from '@clerk/nextjs'
import { OptionalUnlessRequiredId } from 'mongodb'
import { cache } from 'react'

import { parseIngredients } from '@/app/lib/ingredient/parse-ingredients'
import { getStaticData } from '@/app/lib/model/static-data'
import { FIND_NO_ID, connectToDatabase } from '@/app/lib/mongodb'
import { Ingredient, IngredientData, UserEntity } from '@/app/lib/types'

import 'server-only'

const getUserIngredients = cache(
  async (userID?: string): Promise<Record<string, Partial<Ingredient>>> => {
    const { userId: currentUserID } = auth()

    const id = userID ?? currentUserID

    if (!id) return {}

    const { db } = await connectToDatabase()
    const user = await db
      .collection<OptionalUnlessRequiredId<UserEntity>>('user')
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
