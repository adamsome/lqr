import { cache } from 'react'

import { getAllFollowing } from '@/app/lib/model/follow'
import { getIngredientData } from '@/app/lib/model/ingredient-data'
import { getSpecs } from '@/app/lib/model/spec'
import { getStockedBottleCount } from '@/app/lib/stock'
import { Counts } from '@/app/lib/types'

export const getBottleCount = cache(async (userID?: string) =>
  getIngredientData(userID).then(({ dict }) => getStockedBottleCount(dict)),
)

export const getSpecCount = cache(async (userID: string) =>
  getSpecs(userID).then((specs) => specs.length),
)

export const getFollowingCount = cache(async (userID: string) =>
  getAllFollowing(userID).then(
    (follows) => follows.filter(({ follows }) => follows).length,
  ),
)

export const getCounts = cache(
  async (
    userID: string | undefined,
    partial: Partial<Counts> = {},
  ): Promise<Counts> => {
    const [bottles, specs, following] = await Promise.all([
      partial.bottles != null
        ? Promise.resolve(partial.bottles)
        : getBottleCount(userID),
      partial.specs != null || !userID
        ? Promise.resolve(partial.specs ?? 0)
        : getSpecCount(userID),
      partial.following != null || !userID
        ? Promise.resolve(partial.following ?? 0)
        : getFollowingCount(userID),
    ])
    return { bottles, specs, following }
  },
)
