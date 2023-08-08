import { auth } from '@clerk/nextjs'
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

const NO_ID: FindOptions = { projection: { _id: false } }

export async function getSpecs(): Promise<{
  specs: Spec[]
  userDict: Record<string, User>
}> {
  const { userId: id } = auth()
  const { db } = await connectToDatabase()

  let userIDs: string[]
  if (id) {
    const follows = await db
      .collection<OptionalUnlessRequiredId<Follow>>('follow')
      .find({ follower: id })
      .toArray()
    userIDs = [id, ...follows.map((f) => f.followee)]
  } else {
    // TODO: Handle unsigned-in user
    userIDs = []
  }

  const specs = await db
    .collection<OptionalUnlessRequiredId<Spec>>('spec')
    .find({ userID: { $in: userIDs } }, NO_ID)
    .toArray()

  const userDict = userIDs.reduce<Record<string, User>>((acc, id) => {
    const userSpec = specs.find((s) => s.userID === id)
    if (userSpec) {
      const { username, userDisplayName } = userSpec
      acc[username] = { id, username, displayName: userDisplayName }
    }
    return acc
  }, {})

  return { specs, userDict }
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
