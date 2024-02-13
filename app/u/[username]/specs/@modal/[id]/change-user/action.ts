'use server'

import { auth } from '@clerk/nextjs'
import { z } from 'zod'

import { isAdmin } from '@/app/lib/model/admin'
import { getSpec, updateSpecUser } from '@/app/lib/model/spec'
import { getUserByID } from '@/app/lib/model/user'
import { toSpecs } from '@/app/lib/routes'
import { SpecChangeUserSchema } from '@/app/u/[username]/specs/@modal/[id]/change-user/types'
import { revalidatePath } from 'next/cache'

type Schema = z.infer<typeof SpecChangeUserSchema>

export type Response =
  | { ok: false; error: string }
  | { ok: true; message: string }

export async function changeUser(data: Schema): Promise<Response> {
  const { userId: currentUserID } = auth()
  if (!isAdmin(currentUserID)) {
    return { ok: false, error: `Only admins can change spec user` }
  }

  const body = SpecChangeUserSchema.safeParse(data)
  if (!body.success) {
    const { errors } = body.error
    return {
      ok: false,
      error: `Invalid request: ${errors.map((e) => e.message).join('. ')}`,
    }
  }

  const { id, userID, prevUserID, username } = body.data

  const [spec, user, prevUser] = await Promise.all([
    getSpec(id, prevUserID),
    getUserByID(userID),
    getUserByID(prevUserID),
  ])

  if (!spec || !prevUser) {
    return {
      ok: false,
      error: `No spec with ID '${id}' and user ID '${prevUserID}' to change user.`,
    }
  }
  if (!user) {
    return {
      ok: false,
      error: `No user with ID '${userID}' to change spec '${spec.name}' to.`,
    }
  }

  const result = await updateSpecUser(id, prevUserID, user)
  if (result.modifiedCount !== 1) {
    return {
      ok: false,
      error: `Expected to modify 1 spec (actual: ${
        result.modifiedCount
      }) while changing '${spec.name}' user from '${
        prevUser.displayName ?? prevUser.username
      } ' to ${user.displayName ?? user.username}`,
    }
  }
  return {
    ok: true,
    message: `Changed '${spec.name}' user from ${prevUser.username} to ${user.username}`,
  }
}
