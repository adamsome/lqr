import { clerkClient } from '@clerk/nextjs'
import { partition } from 'ramda'
import invariant from 'tiny-invariant'

import { User } from '@/lib/types'
import { toDict } from '@/lib/utils'

import 'server-only'
import { toUser } from '@/lib/model/to-user'
import { connectToDatabase } from '@/lib/mongodb'
import { OptionalUnlessRequiredId } from 'mongodb'

const SYSTEM_USERS = [
  {
    id: 'user_classics',
    username: 'classics',
    displayName: 'Classics',
  },
  {
    id: 'user_smugglerscove',
    username: 'smugglers_cove',
    displayName: "Smuggler's Cove",
  },
  {
    id: 'user_deathcowelcomehome',
    username: 'deathco_welcome_home',
    displayName: 'Death & Co: Welcome Home',
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

export async function getUserByID(
  userID?: string | null,
): Promise<User | null> {
  if (!userID) return null
  if (byID[userID]) return byID[userID]
  const rawUser = await clerkClient.users.getUser(userID)
  invariant(rawUser, `No user found with ID '${userID}'`)
  return toUser(rawUser)
}

export async function getUser(username?: string): Promise<User | null> {
  if (!username) return null
  if (byUsername[username]) return byUsername[username]
  const users = await clerkClient.users.getUserList({ username: [username] })
  if (!users[0]) return null
  return getUserByID(users[0].id)
}

export async function updateUserActedAt(userID: string) {
  const { db } = await connectToDatabase()
  return await db
    .collection<OptionalUnlessRequiredId<User>>('user')
    .updateOne({ id: userID }, { $set: { actedAt: new Date().toISOString() } })
}
