import { OptionalId, OptionalUnlessRequiredId, WithId } from 'mongodb'

import { connectToDatabase } from '@/lib/mongodb'
import { IngredientDef, User } from '@/lib/types'

import 'server-only'

export async function getUserIngredients(): Promise<
  Record<string, Partial<IngredientDef>>
> {
  const { db } = await connectToDatabase()
  const user = await db
    .collection<OptionalUnlessRequiredId<User>>('user')
    .findOne({ username: 'adamb' })
  if (user) {
    delete (user as OptionalId<WithId<User>>)._id
  }
  return user?.ingredients ?? {}
}
