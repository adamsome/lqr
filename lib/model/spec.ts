import {
  Filter,
  FindOptions,
  OptionalId,
  OptionalUnlessRequiredId,
} from 'mongodb'
import invariant from 'tiny-invariant'

import { connectToDatabase } from '@/lib/mongodb'
import { Spec } from '@/lib/types'

import 'server-only'

const NO_ID: FindOptions = { projection: { _id: false } }

export async function getSpecs(userIDs: string[]): Promise<Spec[]> {
  const { db } = await connectToDatabase()
  return await db
    .collection<OptionalUnlessRequiredId<Spec>>('spec')
    .find({ userID: { $in: userIDs } }, NO_ID)
    .toArray()
}

export async function getSpec(
  filter: Filter<OptionalId<Spec>>,
): Promise<Spec | undefined> {
  const { db } = await connectToDatabase()
  const specs: Spec[] =
    (await db
      .collection<OptionalUnlessRequiredId<Spec>>('spec')
      .find(filter, NO_ID)
      .toArray()) ?? []
  if (specs.length !== 1) console.log(filter)
  invariant(specs.length <= 1, `Got multiple specs`)
  return specs[0]
}

export async function updateSpec(spec: Spec) {
  const { db } = await connectToDatabase()
  return await db
    .collection<OptionalUnlessRequiredId<Spec>>('spec')
    .updateOne({ id: spec.id }, { $set: spec })
}

export async function addSpec(spec: Spec) {
  const { db } = await connectToDatabase()
  return await db
    .collection<OptionalUnlessRequiredId<Spec>>('spec')
    .insertOne(spec)
}

export async function deleteSpec(filter: Filter<OptionalId<Spec>>) {
  const { db } = await connectToDatabase()
  return await db
    .collection<OptionalUnlessRequiredId<Spec>>('spec')
    .deleteOne(filter)
}
