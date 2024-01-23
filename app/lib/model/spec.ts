import { Filter, OptionalId, OptionalUnlessRequiredId } from 'mongodb'
import invariant from 'tiny-invariant'

import { FIND_NO_ID, connectToDatabase } from '@/app/lib/mongodb'
import { Spec } from '@/app/lib/types'
import { asArray } from '@/app/lib/utils'

import 'server-only'

export async function getSpec(
  id: string | undefined,
  userID: string | undefined,
): Promise<Spec | undefined> {
  if (!id || !userID) return undefined
  const { db } = await connectToDatabase()
  const specs: Spec[] =
    (await db
      .collection<OptionalUnlessRequiredId<Spec>>('spec')
      .find({ id }, FIND_NO_ID)
      .toArray()) ?? []
  invariant(specs.length <= 1, `Got multiple specs`)
  return specs[0]
}

export async function getAllSpecs(userID: string | undefined): Promise<Spec[]> {
  const { db } = await connectToDatabase()
  if (!userID) return []
  return db
    .collection<OptionalUnlessRequiredId<Spec>>('spec')
    .find({ userID }, FIND_NO_ID)
    .toArray()
}

export async function getAllSpecsWithUserIDs(
  userIDOrIDs: string[],
): Promise<Spec[]> {
  const { db } = await connectToDatabase()
  const userIDs = asArray(userIDOrIDs)
  if (userIDs.length === 0) return []
  if (userIDs.length === 1) {
    return getAllSpecs(userIDOrIDs[0])
  }
  return db
    .collection<OptionalUnlessRequiredId<Spec>>('spec')
    .find({ userID: { $in: userIDs } }, FIND_NO_ID)
    .toArray()
}

export async function updateSpec(spec: Spec) {
  const { db } = await connectToDatabase()
  return db
    .collection<OptionalUnlessRequiredId<Spec>>('spec')
    .updateOne({ id: spec.id }, { $set: spec })
}

export async function addSpec(spec: Spec) {
  const { db } = await connectToDatabase()
  return db.collection<OptionalUnlessRequiredId<Spec>>('spec').insertOne(spec)
}

export async function deleteSpec(filter: Filter<OptionalId<Spec>>) {
  const { db } = await connectToDatabase()
  return db.collection<OptionalUnlessRequiredId<Spec>>('spec').deleteOne(filter)
}
