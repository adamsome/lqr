import { OptionalUnlessRequiredId } from 'mongodb'

import { FIND_NO_ID, connectToDatabase } from '@/lib/mongodb'
import { Follow } from '@/lib/types'

type PrimaryFollow = Pick<Follow, 'followee' | 'follower'>

export async function getFollow<T extends PrimaryFollow>(
  follow: T,
): Promise<Follow | null> {
  const { db } = await connectToDatabase()
  return db
    .collection<OptionalUnlessRequiredId<Follow>>('follow')
    .findOne(follow)
    .then((res) => {
      if (!res) return null
      const { _id, ...rest } = res
      return rest
    })
}

export async function getFolloweeIDs(userID: string): Promise<Follow[]> {
  const { db } = await connectToDatabase()
  return db
    .collection<OptionalUnlessRequiredId<Follow>>('follow')
    .find({ follower: userID }, FIND_NO_ID)
    .toArray()
}

export async function addFollow(follow: Follow) {
  const { db } = await connectToDatabase()
  const existing = await getFollow(follow)
  if (existing) return
  return db
    .collection<OptionalUnlessRequiredId<Follow>>('follow')
    .insertOne(follow)
}

export async function deleteFollow(follow: PrimaryFollow) {
  const { db } = await connectToDatabase()
  const existing = await getFollow(follow)
  if (!existing) return
  return db
    .collection<OptionalUnlessRequiredId<Follow>>('follow')
    .deleteOne(follow)
}
