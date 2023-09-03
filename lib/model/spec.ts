import { auth, clerkClient } from '@clerk/nextjs'
import {
  Filter,
  FindOptions,
  OptionalId,
  OptionalUnlessRequiredId,
} from 'mongodb'
import invariant from 'tiny-invariant'

import { connectToDatabase } from '@/lib/mongodb'
import { Follow, Spec, User } from '@/lib/types'

import 'server-only'
import { getFolloweeIDs } from '@/lib/model/follow'

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
  const spec: Spec[] = await db
    .collection<OptionalUnlessRequiredId<Spec>>('spec')
    .find(filter, NO_ID)
    .toArray()
  invariant((spec?.length ?? 0) <= 1, `Got multiple specs`)
  return spec[0]
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
