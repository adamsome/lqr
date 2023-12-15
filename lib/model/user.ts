import { auth, clerkClient } from '@clerk/nextjs'
import { OptionalUnlessRequiredId } from 'mongodb'
import { partition } from 'ramda'
import invariant from 'tiny-invariant'

import { connectToDatabase } from '@/lib/mongodb'
import { Ingredient, User } from '@/lib/types'
import { toIDMap } from '@/lib/utils'

import 'server-only'

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
    displayName: 'Death & Co Welcome Home',
  },
]

const byID = toIDMap(SYSTEM_USERS, ({ id }) => id)
const byUsername = toIDMap(SYSTEM_USERS, ({ username }) => username)

export async function getUserIngredients(
  userID?: string,
): Promise<Record<string, Partial<Ingredient>>> {
  const { userId: currentUserID } = auth()

  const id = userID ?? currentUserID

  if (!id) return {}

  const { db } = await connectToDatabase()
  const user = await db
    .collection<OptionalUnlessRequiredId<User>>('user')
    .findOne({ id }, { projection: { _id: false } })
  return user?.ingredients ?? {}
}

export async function getManyUsers(userIDs: string[]): Promise<User[]> {
  const [systemIDs, ids] = partition((id) => byID[id] !== undefined, userIDs)
  const systemUsers = systemIDs.map((id) => byID[id])
  const rawUsers = await clerkClient.users.getUserList({ userId: ids })
  const users = rawUsers.map((u) => ({
    id: u.id,
    username: u.username ?? u.emailAddresses[0]?.emailAddress ?? 'Unknown',
    imageUrl: u.imageUrl,
  }))
  return [...systemUsers, ...users]
}

export async function getUserByID(
  userID?: string | null,
): Promise<User | null> {
  if (!userID) return null
  const users = await getManyUsers([userID])
  invariant(users[0], `No user found with ID '${userID}'`)
  return users[0]
}

export async function getUser(username?: string): Promise<User | null> {
  if (!username) return null
  if (byUsername[username]) return byUsername[username]
  const users = await clerkClient.users.getUserList({ username: [username] })
  if (!users[0]) return null
  return getUserByID(users[0].id)
}
