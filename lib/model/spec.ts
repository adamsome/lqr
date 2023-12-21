import { Filter, OptionalId, OptionalUnlessRequiredId } from 'mongodb'
import invariant from 'tiny-invariant'

import { FIND_NO_ID, connectToDatabase } from '@/lib/mongodb'
import { Spec } from '@/lib/types'

import 'server-only'

export async function getSpecs(userIDs: string[]): Promise<Spec[]> {
  const { db } = await connectToDatabase()
  return db
    .collection<OptionalUnlessRequiredId<Spec>>('spec')
    .find({ userID: { $in: userIDs } }, FIND_NO_ID)
    .toArray()
}

export async function getSpec(
  filter: Filter<OptionalId<Spec>>,
): Promise<Spec | undefined> {
  const { db } = await connectToDatabase()
  const specs: Spec[] =
    (await db
      .collection<OptionalUnlessRequiredId<Spec>>('spec')
      .find(filter, FIND_NO_ID)
      .toArray()) ?? []
  if (specs.length !== 1) console.log(filter)
  invariant(specs.length <= 1, `Got multiple specs`)
  return specs[0]
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
