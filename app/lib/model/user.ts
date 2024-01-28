import { auth, clerkClient } from '@clerk/nextjs'
import { OptionalUnlessRequiredId } from 'mongodb'
import { partition } from 'ramda'
import { cache } from 'react'
import invariant from 'tiny-invariant'

import { toUser } from '@/app/lib/model/to-user'
import { FIND_NO_ID, connectToDatabase } from '@/app/lib/mongodb'
import { User, UserEntity } from '@/app/lib/types'
import { toDict } from '@/app/lib/utils'

import 'server-only'

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
    displayName: 'smugglers_cove',
    imageUrl: '/avatars/smugglers-cove.jpg',
  },
  {
    id: 'user_deathcowelcomehome',
    username: 'deathco_welcome_home',
    displayName: 'deathco',
    imageUrl: '/avatars/deathco-welcome-home.jpg',
  },
]

const byID = toDict(SYSTEM_USERS, ({ id }) => id)
const byUsername = toDict(SYSTEM_USERS, ({ username }) => username)

const connect = async () =>
  connectToDatabase().then(({ db }) =>
    db.collection<OptionalUnlessRequiredId<UserEntity>>('user'),
  )

export async function getAllUsers(userIDs: string[]): Promise<User[]> {
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
    return toUser(users[0])
  },
)

type CurrentUserWithUser = {
  user: User | null
  currentUser: User | null
  isSignedIn: boolean
  isCurrentUser: boolean
}

type CurrentUserOnly = Omit<CurrentUserWithUser, 'user' | 'isCurrentUser'>

async function _getCurrentUser(): Promise<CurrentUserOnly>
async function _getCurrentUser(
  username: string | undefined,
): Promise<CurrentUserWithUser>

async function _getCurrentUser(
  username?: string,
): Promise<CurrentUserWithUser | CurrentUserOnly> {
  const { userId: currentUserID } = auth()
  const [user, currentUser] = await Promise.all([
    getUser(username),
    getUserByID(currentUserID),
  ])
  const isSignedIn = currentUser != null
  if (username === undefined) return { currentUser, isSignedIn }
  const isCurrentUser = isSignedIn && user?.id === currentUser.id
  return { user, currentUser, isSignedIn, isCurrentUser }
}

export const getCurrentUser = cache(_getCurrentUser)

export const isCurrentUser = cache(async (username: string | undefined) => {
  const { userId: currentUserID } = auth()
  const user = await getUser(username)
  return currentUserID != null && user?.id === currentUserID
})

export const getUserEntity = cache(async (userID?: string) => {
  if (!userID) return null
  const cn = await connect()
  return cn.findOne({ id: userID }, FIND_NO_ID)
})

export async function getMostRecentActedUsers({
  exclude = [],
  limit = 5,
}: {
  exclude?: string[]
  limit?: number
} = {}) {
  const cn = await connect()
  const users = await cn
    .find(
      { id: { $nin: exclude }, specCount: { $gt: 3 } },
      { projection: { _id: 0, id: 1 } },
    )
    .sort({ actedAt: -1 })
    .limit(limit)
    .toArray()
  return getAllUsers(users.map(({ id }) => id))
}

export async function updateUserActedAt(userID: string) {
  const cn = await connect()
  return cn.updateOne(
    { id: userID },
    { $set: { actedAt: new Date().toISOString() } },
  )
}

export async function addUser(user: User) {
  const cn = await connect()
  return cn.insertOne(user)
}

export async function updateUserSpecCount(userID: string, count: number) {
  const cn = await connect()
  return cn.updateOne({ id: userID }, { $set: { specCount: count } })
}

export async function updateUserFollowingCount(userID: string, count: number) {
  const cn = await connect()
  return cn.updateOne({ id: userID }, { $set: { followingCount: count } })
}
