import { OptionalUnlessRequiredId } from 'mongodb'
import { partition } from 'ramda'
import { cache } from 'react'

import { isAdmin as isUserAdmin } from '@/app/lib/model/admin'
import { SYSTEM_USERS } from '@/app/lib/model/system-users'
import { FIND_NO_ID, connectToDatabase } from '@/app/lib/mongodb'
import { getSessionUserID } from '@/app/lib/session'
import { User, UserEntity, type UserWithEntity } from '@/app/lib/types'
import { toDict } from '@/app/lib/utils'

import 'server-only'

export { SYSTEM_USERS }

const byID = toDict(SYSTEM_USERS, ({ id }) => id)
const byUsername = toDict(SYSTEM_USERS, ({ username }) => username)

const connect = async () =>
  connectToDatabase().then(({ db }) =>
    db.collection<OptionalUnlessRequiredId<UserEntity>>('user'),
  )

const toUser = ({ id, username, imageUrl }: UserEntity): User => ({
  id,
  username,
  imageUrl,
})

export async function getAllUsers(userIDs: string[]): Promise<User[]> {
  const [systemIDs, ids] = partition((id) => byID[id] !== undefined, userIDs)
  const systemUsers = systemIDs.map((id) => byID[id])

  const entities =
    ids.length > 0
      ? await (await connect()).find({ id: { $in: ids } }, FIND_NO_ID).toArray()
      : []
  const users = entities.map(toUser)

  return [...users, ...systemUsers]
}

export const getUserByID = cache(
  async (userID?: string | null): Promise<User | null> => {
    if (!userID) return null
    if (byID[userID]) return byID[userID]
    const entity = await (await connect()).findOne({ id: userID }, FIND_NO_ID)
    return entity ? toUser(entity) : null
  },
)

export const getUser = cache(
  async (username?: string): Promise<User | null> => {
    if (!username) return null
    if (byUsername[username]) return byUsername[username]
    const entity = await (await connect()).findOne({ username }, FIND_NO_ID)
    return entity ? toUser(entity) : null
  },
)

export const getUserEntity = cache(
  async (userID?: string | null): Promise<UserEntity | null> => {
    if (!userID) return null
    const cn = await connect()
    return cn.findOne({ id: userID }, FIND_NO_ID)
  },
)

type CurrentUserWithUser = {
  user: User | null
  currentUser: UserWithEntity | null
  isSignedIn: boolean
  isCurrentUser: boolean
  isAdmin: boolean
}

type CurrentUserOnly = Omit<CurrentUserWithUser, 'user' | 'isCurrentUser'>

async function _getCurrentUser(): Promise<CurrentUserOnly>
async function _getCurrentUser(
  username: string | undefined,
): Promise<CurrentUserWithUser>

async function _getCurrentUser(
  username?: string,
): Promise<CurrentUserWithUser | CurrentUserOnly> {
  const currentUserID = await getSessionUserID()
  const [user, currentAuth, currentEntity] = await Promise.all([
    getUser(username),
    getUserByID(currentUserID),
    getUserEntity(currentUserID),
  ])
  const currentUser: UserWithEntity | null = currentAuth
    ? { ...(currentEntity ?? {}), ...currentAuth }
    : null
  const isSignedIn = currentUser != null
  const isAdmin = isUserAdmin(currentUser?.id)
  if (username === undefined) return { currentUser, isSignedIn, isAdmin }
  const isCurrentUser = isSignedIn && user?.id === currentUser.id
  return {
    user,
    currentUser,
    isSignedIn,
    isCurrentUser,
    isAdmin,
  }
}

export const getCurrentUser = cache(_getCurrentUser)

export const isCurrentUser = cache(async (username: string | undefined) => {
  const currentUserID = await getSessionUserID()
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

export async function updateUserFtue(userID: string, ftue: string) {
  const cn = await connect()
  return cn.updateOne({ id: userID }, { $set: { ftue } })
}

export async function addUserExcludeFollowee(userID: string, followee: string) {
  const cn = await connect()
  return cn.updateOne(
    { id: userID },
    { $addToSet: { excludeFollowees: followee } },
  )
}

export async function setUserExcludedAllFolloweesAt(userID: string) {
  const cn = await connect()
  return cn.updateOne(
    { id: userID },
    { $set: { excludedAllFolloweesAt: new Date().toISOString() } },
  )
}

export async function updateUserActedAt(userID: string) {
  const cn = await connect()
  return cn.updateOne(
    { id: userID },
    { $set: { actedAt: new Date().toISOString() } },
  )
}

// Create the user's record if missing (no-op when it exists)
export async function ensureUserEntity({ id, username }: User) {
  const cn = await connect()
  return cn.updateOne(
    { id },
    { $setOnInsert: { id, username } },
    { upsert: true },
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
