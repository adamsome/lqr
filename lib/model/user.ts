import { auth, clerkClient } from '@clerk/nextjs'
import { OptionalUnlessRequiredId } from 'mongodb'
import invariant from 'tiny-invariant'

import { connectToDatabase } from '@/lib/mongodb'
import { Ingredient, User } from '@/lib/types'

import 'server-only'
import { partition } from 'ramda'

const USERS: Record<string, User> = {
  user_classics: {
    id: 'user_classics',
    username: 'classics',
    displayName: 'Classics',
  },
  user_smugglerscove: {
    id: 'user_smugglerscove',
    username: 'smugglers_cove',
    displayName: "Smuggler's Cove",
  },
  user_deathcowelcomehome: {
    id: 'user_deathcowelcomehome',
    username: 'deathco_welcome_home',
    displayName: 'Death & Co Welcome Home',
  },
}

const ADMINS: Record<string, boolean> = { adamsome: true }

export async function getUserIngredients(): Promise<
  Record<string, Partial<Ingredient>>
> {
  const { userId: id } = auth()
  invariant(id, `User ID requried to get user data`)

  const { db } = await connectToDatabase()
  const user = await db
    .collection<OptionalUnlessRequiredId<User>>('user')
    .findOne({ id }, { projection: { _id: false } })
  return user?.ingredients ?? {}
}

export async function getManyUsers(userIDs: string[]): Promise<User[]> {
  const [systemIDs, ids] = partition((u) => USERS[u] !== undefined, userIDs)
  const systemUsers = systemIDs.map((id) => USERS[id])
  const rawUsers = await clerkClient.users.getUserList({ userId: ids })
  const users = rawUsers.map((u) => {
    const user: User = {
      id: u.id,
      username: u.username ?? u.emailAddresses[0]?.emailAddress ?? 'Unknown',
      imageUrl: u.imageUrl,
    }
    if (u.username && ADMINS[u.username]) user.admin = true
    return user
  })
  return [...systemUsers, ...users]
}

export async function getOneUser(userID?: string | null): Promise<User | null> {
  if (!userID) return null
  const users = await getManyUsers([userID])
  invariant(users[0], `No user found with ID '${userID}'`)
  return users[0]
}
