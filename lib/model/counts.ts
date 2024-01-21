import { cache } from 'react'

import { getFollowsByFollower } from '@/lib/model/follow'
import { getIngredientData } from '@/lib/model/ingredient-data'
import { getSpecs } from '@/lib/model/spec'
import { getStockedBottleCount } from '@/lib/stock'
import { Counts } from '@/lib/types'

export const getBottleCount = cache(async (userID?: string) =>
  getIngredientData(userID).then(({ dict }) => getStockedBottleCount(dict)),
)

export const getSpecCount = cache(async (userID: string) =>
  getSpecs(userID).then((specs) => specs.length),
)

export const getFollowingCount = cache(async (userID: string) =>
  getFollowsByFollower(userID).then(
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
