import { cache } from 'react'

import { getAllFollowing } from '@/app/lib/model/follow'
import { getIngredientData } from '@/app/lib/model/ingredient-data'
import { getAllSpecs } from '@/app/lib/model/spec'
import { getStockedBottleCount } from '@/app/lib/stock'
import { Counts } from '@/app/lib/types'

export const getBottleCount = cache(async (userID?: string) =>
  getIngredientData(userID).then(({ dict }) => getStockedBottleCount(dict)),
)

export const getSpecCount = cache(async (userID: string) =>
  getAllSpecs(userID).then((specs) => specs.length),
)

export const getFollowingCount = cache(async (userID: string) =>
  getAllFollowing(userID).then(
    (follows) => follows.filter(({ follows }) => follows).length,
  ),
)

export const getCounts = cache(
  async (userID: string | undefined): Promise<Counts> => {
    if (!userID) return { bottles: 0, specs: 0, following: 0 }
    const [bottles, specs, following] = await Promise.all([
      getBottleCount(userID),
      getSpecCount(userID),
      getFollowingCount(userID),
    ])
    return { bottles, specs, following }
  },
)
