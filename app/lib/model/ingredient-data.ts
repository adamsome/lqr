import { auth } from '@clerk/nextjs'
import { OptionalUnlessRequiredId } from 'mongodb'
import { cache } from 'react'

import {
  shouldIgnoreIngredient,
  similarSet,
} from '@/app/lib/ingredient/get-spec-stock'
import { parseIngredients } from '@/app/lib/ingredient/parse-ingredients'
import { getStaticData } from '@/app/lib/model/static-data'
import { FIND_NO_ID, connectToDatabase } from '@/app/lib/mongodb'
import { Ingredient, IngredientData, UserEntity } from '@/app/lib/types'
import { rejectNil } from '@/app/lib/utils'
import { buildCategoryData } from '@/app/u/[username]/bar/lib/category-builder'
import { SAMPLE_INGREDIENT_DATA } from '../ingredient/samples'

import 'server-only'

const getUserIngredients = cache(
  async (userID?: string): Promise<Record<string, Partial<Ingredient>>> => {
    const { userId: currentUserID } = auth()

    const id = userID ?? currentUserID

    if (!id) return SAMPLE_INGREDIENT_DATA

    const { db } = await connectToDatabase()
    const user = await db
      .collection<OptionalUnlessRequiredId<UserEntity>>('user')
      .findOne({ id }, FIND_NO_ID)
    return user?.ingredients ?? {}
  },
)

const expectNoCategory: Record<string, boolean> = {
  agave_tequila: true,
  cane_rum: true,
  fortifiedwine_sherry: true,
  grain_gin: true,
  grain_whiskey: true,
  grain_whiskey_scotch: true,
  liqueur_amaro_light: true,
}

export const getIngredientData = cache(
  async (userID?: string): Promise<IngredientData> => {
    const [userIngredients, staticData] = await Promise.all([
      getUserIngredients(userID),
      getStaticData(),
    ])
    const { baseIngredients, ingredients, tree } = staticData
    const dict = parseIngredients(baseIngredients, userIngredients, ingredients)

    const data = { dict, tree }
    const { categories, keysByIngredientID } = await buildCategoryData(data)
    Object.keys(dict).forEach((id) => {
      let keys = keysByIngredientID.get(id)
      if (!keys?.category) {
        const similarIDs = similarSet.get(id) ?? []
        const similarKeys = rejectNil(
          similarIDs.map((similarID) => keysByIngredientID.get(similarID)),
        )
        keys = similarKeys[0]
        if (!keys?.category) {
          if (!shouldIgnoreIngredient(id) && !expectNoCategory[id]) {
            console.warn(`No bar category found for ingredient '${id}'`)
          }
          return
        }
      }
      const category = categories.get(keys.category)
      if (!category) {
        console.error(
          `No bar category found for category key '${keys.category}'`,
        )
        return
      }
      dict[id].categoryKeys = keys
    })

    return { dict, tree }
  },
)
