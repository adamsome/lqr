import { cache } from 'react'

import { getFollowingCount } from '@/app/lib/model/follow'
import { getIngredientData } from '@/app/lib/model/ingredient-data'
import { getUserEntity } from '@/app/lib/model/user'
import { getStockedBottleCount } from '@/app/lib/stock'
import { Counts } from '@/app/lib/types'

export const getBottleCount = cache(async (userID?: string) =>
  getIngredientData(userID).then(({ dict }) => getStockedBottleCount(dict)),
)

export const getCounts = cache(
  async (userID: string | undefined): Promise<Counts> => {
    const [user, bottles, following] = await Promise.all([
      getUserEntity(userID),
      getBottleCount(userID),
      userID ? getFollowingCount(userID) : 0,
    ])
    const { specCount = 0 } = user ?? {}
    return { bottles, specs: specCount, following }
  },
)
