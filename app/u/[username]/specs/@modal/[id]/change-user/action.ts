'use server'

import { auth } from '@clerk/nextjs'
import { z } from 'zod'

import { isAdmin } from '@/app/lib/model/admin'
import { getSpec, updateSpecUser } from '@/app/lib/model/spec'
import { getUserByID } from '@/app/lib/model/user'
import { SpecChangeUserSchema } from '@/app/u/[username]/specs/@modal/[id]/change-user/types'
import { redirect } from 'next/navigation'
import { toSpecs } from '@/app/lib/routes'

type Schema = z.infer<typeof SpecChangeUserSchema>

export type Error = {
  error: string
}

export async function changeUser(data: Schema): Promise<Error> {
  const { userId: currentUserID } = auth()
  if (!isAdmin(currentUserID)) {
    return { error: `Only admins can change spec user` }
  }

  const body = SpecChangeUserSchema.safeParse(data)
  if (!body.success) {
    const { errors } = body.error
    return {
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
      error: `No spec with ID '${id}' and user ID '${prevUserID}' to change user.`,
    }
  }
  if (!user) {
    return {
      error: `No user with ID '${userID}' to change spec '${spec.name}' to.`,
    }
  }

  const result = await updateSpecUser(id, prevUserID, user)
  if (result.modifiedCount !== 1) {
    return {
      error: `Expected to modify 1 spec (actual: ${
        result.modifiedCount
      }) while changing '${spec.name}' user from '${
        prevUser.displayName ?? prevUser.username
      } ' to ${user.displayName ?? user.username}`,
    }
  }
  redirect(toSpecs(username))
}
