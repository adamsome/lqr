import { auth, clerkClient } from '@clerk/nextjs'
import { partition } from 'ramda'
import invariant from 'tiny-invariant'

import { User } from '@/lib/types'
import { toDict } from '@/lib/utils'

import { toUser } from '@/lib/model/to-user'
import { connectToDatabase } from '@/lib/mongodb'
import { OptionalUnlessRequiredId } from 'mongodb'
import 'server-only'
import { cache } from 'react'

const SYSTEM_USERS = [
  {
    id: 'user_classics',
    username: 'classics',
    displayName: 'Classics',
    imageUrl: '/avatars/classic.jpg',
  },
  {
    id: 'user_smugglerscove',
    username: 'smugglers_cove',
    displayName: "Smuggler's Cove",
    imageUrl: '/avatars/smugglers-cove.jpg',
  },
  {
    id: 'user_deathcowelcomehome',
    username: 'deathco_welcome_home',
    displayName: 'Death & Co: Welcome Home',
    imageUrl: '/avatars/deathco-welcome-home.jpg',
  },
]

const byID = toDict(SYSTEM_USERS, ({ id }) => id)
const byUsername = toDict(SYSTEM_USERS, ({ username }) => username)

export async function getManyUsers(userIDs: string[]): Promise<User[]> {
  const [systemIDs, ids] = partition((id) => byID[id] !== undefined, userIDs)
  const systemUsers = systemIDs.map((id) => byID[id])

  const rawUsers =
    ids.length > 0 ? await clerkClient.users.getUserList({ userId: ids }) : []
  const users = rawUsers.map(toUser)

  return [...users, ...systemUsers]
}

export const getUserByID = cache(
  async (userID?: string | null): Promise<User | null> => {
    if (!userID) return null
    if (byID[userID]) return byID[userID]
    const rawUser = await clerkClient.users.getUser(userID)
    invariant(rawUser, `No user found with ID '${userID}'`)
    return toUser(rawUser)
  },
)

export const getUser = cache(
  async (username?: string): Promise<User | null> => {
    if (!username) return null
    if (byUsername[username]) return byUsername[username]
    const users = await clerkClient.users.getUserList({ username: [username] })
    if (!users[0]) return null
    return getUserByID(users[0].id)
  },
)

export const isCurrentUser = cache(async (username: string | undefined) => {
  const { userId: currentUserID } = auth()
  const user = await getUser(username)
  return currentUserID != null && user?.id === currentUserID
})

export async function getMostRecentActedUsers({
  exclude = [],
  limit = 5,
}: {
  exclude?: string[]
  limit?: number
} = {}) {
  const { db } = await connectToDatabase()
  const users = await db
    .collection<OptionalUnlessRequiredId<User>>('user')
    .find({ id: { $nin: exclude } }, { projection: { _id: 0, id: 1 } })
    .sort({ actedAt: -1 })
    .limit(limit)
    .toArray()
  return getManyUsers(users.map(({ id }) => id))
}

export async function updateUserActedAt(userID: string) {
  const { db } = await connectToDatabase()
  return db
    .collection<OptionalUnlessRequiredId<User>>('user')
    .updateOne({ id: userID }, { $set: { actedAt: new Date().toISOString() } })
}
