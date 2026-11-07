import { OptionalUnlessRequiredId } from 'mongodb'
import { cache } from 'react'

import { FIND_NO_ID, connectToDatabase } from '@/app/lib/mongodb'
import { Follow } from '@/app/lib/types'
import { updateUserFollowingCount } from '@/app/lib/model/user'

type FollowKeys = Pick<Follow, 'followee' | 'follower'>

const connect = async () =>
  connectToDatabase().then(({ db }) =>
    db.collection<OptionalUnlessRequiredId<Follow>>('follow'),
  )

export const getFollow = cache(
  async (followee: string, follower: string): Promise<Follow | null> => {
    const cn = await connect()
    return cn.findOne({ follower, followee }).then((res) => {
      if (!res) return null
      const { _id, ...rest } = res
      return rest
    })
  },
)

export const getAllFollowing = cache(
  async (userID?: string): Promise<Follow[]> => {
    if (!userID) return []
    const cn = await connect()
    return cn.find({ follower: userID }, FIND_NO_ID).toArray()
  },
)

// Uncached so it reflects writes made earlier in the same request
async function countFollowing(userID: string) {
  const cn = await connect()
  return cn.countDocuments({ follower: userID, follows: true })
}

export const getFollowingCount = cache(countFollowing)

export async function upsertFollow(follow: Follow) {
  const cn = await connect()
  const result = await cn.updateOne(
    { followee: follow.followee, follower: follow.follower },
    { $set: follow },
    { upsert: true },
  )
  const count = await countFollowing(follow.follower)
  await updateUserFollowingCount(follow.follower, count)
  return result
}

export async function deleteFollow(follow: FollowKeys) {
  const cn = await connect()
  const existing = await getFollow(follow.followee, follow.follower)
  if (!existing) return
  return cn.deleteOne(follow)
}
