import { auth } from '@clerk/nextjs'
import { OptionalUnlessRequiredId } from 'mongodb'
import invariant from 'tiny-invariant'

import { connectToDatabase } from '@/lib/mongodb'
import { Follow, Spec, User } from '@/lib/types'

import 'server-only'

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
    .find({ userID: { $in: userIDs } }, { projection: { _id: false } })
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

export async function getSpec(id: string): Promise<Spec> {
  const { db } = await connectToDatabase()
  const spec: Spec[] = await db
    .collection<OptionalUnlessRequiredId<Spec>>('spec')
    .find({ id }, { projection: { _id: false } })
    .toArray()
  invariant(spec?.length === 1, `Found multiple specs with id '${id}<`)
  return spec[0]
}

export async function updateSpec(spec: Spec) {
  const { db } = await connectToDatabase()
  await db
    .collection<OptionalUnlessRequiredId<Spec>>('spec')
    .updateOne({ id: spec.id }, { $set: spec })
}
