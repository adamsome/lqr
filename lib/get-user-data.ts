import { auth } from '@clerk/nextjs'
import { OptionalId, OptionalUnlessRequiredId, WithId } from 'mongodb'
import invariant from 'tiny-invariant'

import { connectToDatabase } from '@/lib/mongodb'
import { IngredientDef, User } from '@/lib/types'

import 'server-only'

export async function getUserData(): Promise<
  Record<string, Partial<IngredientDef>>
> {
  const { userId: id } = auth()
  invariant(id, `User ID requried to get user data`)

  const { db } = await connectToDatabase()
  const user = await db
    .collection<OptionalUnlessRequiredId<User>>('user')
    .findOne({ id })
  if (user) {
    delete (user as OptionalId<WithId<User>>)._id
  }
  return user?.ingredients ?? {}
}
