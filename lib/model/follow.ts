import { OptionalUnlessRequiredId } from 'mongodb'

import { connectToDatabase } from '@/lib/mongodb'
import { Follow } from '@/lib/types'

export async function getFolloweeIDs(follower: string) {
  const { db } = await connectToDatabase()
  const follows = await db
    .collection<OptionalUnlessRequiredId<Follow>>('follow')
    .find({ follower })
    .toArray()
  return follows.map((f) => f.followee)
}
