import { OptionalUnlessRequiredId } from 'mongodb'

import { connectToDatabase } from '@/lib/mongodb'
import { Follow } from '@/lib/types'

export async function getFolloweeIDs(userID: string) {
  const { db } = await connectToDatabase()
  return db
    .collection<OptionalUnlessRequiredId<Follow>>('follow')
    .find({ follower: userID })
    .toArray()
    .then((users) => users.map(({ followee }) => followee))
    .then((followeeIDs) => [userID].concat(followeeIDs))
}
