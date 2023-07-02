import { auth } from '@clerk/nextjs'
import { OptionalUnlessRequiredId } from 'mongodb'
import invariant from 'tiny-invariant'

import { connectToDatabase } from '@/lib/mongodb'
import { Ingredient, User } from '@/lib/types'

import 'server-only'

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
