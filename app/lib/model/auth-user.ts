import { OptionalUnlessRequiredId } from 'mongodb'

import { SYSTEM_USERS } from '@/app/lib/model/system-users'
import { mongo } from '@/app/lib/mongodb'
import type { UserEntity } from '@/app/lib/types'

import 'server-only'

// Better Auth's collections are prefixed so they don't collide with lqr's
// own `user` collection (the app's profile + inventory record)
export const AUTH_MODELS = {
  user: 'auth_user',
  session: 'auth_session',
  account: 'auth_account',
  verification: 'auth_verification',
} as const

export const USERNAME_MIN = 3
export const USERNAME_MAX = 30
const USERNAME_PATTERN = /^[a-z0-9_]+$/

const RESERVED = new Set([
  ...SYSTEM_USERS.map(({ username }) => username),
  'admin',
  'api',
  'sign_in',
  'sign_up',
])

export const isValidUsername = (username: string) =>
  USERNAME_PATTERN.test(username) && !RESERVED.has(username)

const entities = () =>
  mongo.db.collection<OptionalUnlessRequiredId<UserEntity>>('user')

async function isUsernameTaken(username: string) {
  if (RESERVED.has(username)) return true
  const [entity, authUser] = await Promise.all([
    entities().findOne({ username }, { projection: { _id: 1 } }),
    mongo.db
      .collection(AUTH_MODELS.user)
      .findOne({ username }, { projection: { _id: 1 } }),
  ])
  return entity != null || authUser != null
}

// Derive an available username from an email, e.g. `jane.doe@x.com` -> `jane_doe`
export async function generateUsername(email: string) {
  let base = (email.split('@')[0] ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, USERNAME_MAX - 4)
  if (base.length < USERNAME_MIN) base = `${base}_user`.replace(/^_/, '')
  for (let i = 1; i < 1000; i++) {
    const candidate = i === 1 ? base : `${base}${i}`
    if (!(await isUsernameTaken(candidate))) return candidate
  }
  throw new Error(`Could not generate a username for '${email}'`)
}

type AuthUserLike = {
  id: string
  username?: string | null
  image?: string | null
}

// Mirror the auth user's username + avatar into lqr's `user` record
export async function syncUserEntity({ id, username, image }: AuthUserLike) {
  if (!username) return
  await entities().updateOne(
    { id },
    {
      $set: { username, imageUrl: image ?? undefined },
      $setOnInsert: { id },
    },
    { upsert: true, ignoreUndefined: true },
  )
}
