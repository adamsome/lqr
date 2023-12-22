import { OptionalUnlessRequiredId } from 'mongodb'

import { FIND_NO_ID, connectToDatabase } from '@/lib/mongodb'
import { Follow } from '@/lib/types'

type FollowKeys = Pick<Follow, 'followee' | 'follower'>

const connect = async () =>
  connectToDatabase().then(({ db }) =>
    db.collection<OptionalUnlessRequiredId<Follow>>('follow'),
  )

export async function getFollow<T extends FollowKeys>(
  follow: T,
): Promise<Follow | null> {
  const cn = await connect()
  return cn.findOne(follow).then((res) => {
    if (!res) return null
    const { _id, ...rest } = res
    return rest
  })
}

export async function getFollowsByFollower(userID: string): Promise<Follow[]> {
  const cn = await connect()
  return cn.find({ follower: userID }, FIND_NO_ID).toArray()
}

export async function upsertFollow(follow: Follow) {
  const cn = await connect()
  return cn.updateOne(
    { followee: follow.followee, follower: follow.follower },
    { $set: follow },
    { upsert: true },
  )
}

export async function deleteFollow(follow: FollowKeys) {
  const cn = await connect()
  const existing = await getFollow(follow)
  if (!existing) return
  return cn.deleteOne(follow)
}
