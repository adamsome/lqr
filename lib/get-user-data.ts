import { OptionalId, OptionalUnlessRequiredId, WithId } from 'mongodb'

import { connectToDatabase } from '@/lib/mongodb'
import { IngredientDef, User } from '@/lib/types'

import 'server-only'

export async function getUserData(): Promise<
  Record<string, Partial<IngredientDef>>
> {
  const { db } = await connectToDatabase()
  const user = await db
    .collection<OptionalUnlessRequiredId<User>>('user')
    .findOne({ username: 'adamsome' })
  if (user) {
    delete (user as OptionalId<WithId<User>>)._id
  }
  return user?.ingredients ?? {}
}
