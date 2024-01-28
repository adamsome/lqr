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

export const getFollowingCount = cache(async (userID: string) =>
  getAllFollowing(userID).then(
    (follows) => follows.filter(({ follows }) => follows).length,
  ),
)

export async function upsertFollow(follow: Follow) {
  const cn = await connect()
  const count = await getFollowingCount(follow.follower)
  const delta = follow.follows ? 1 : -1
  console.log('count', count, follow, delta)
  await updateUserFollowingCount(follow.follower, count + delta)
  return cn.updateOne(
    { followee: follow.followee, follower: follow.follower },
    { $set: follow },
    { upsert: true },
  )
}

export async function deleteFollow(follow: FollowKeys) {
  const cn = await connect()
  const existing = await getFollow(follow.followee, follow.follower)
  if (!existing) return
  return cn.deleteOne(follow)
}
