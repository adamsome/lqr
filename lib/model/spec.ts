import { auth } from '@clerk/nextjs'
import { OptionalUnlessRequiredId } from 'mongodb'
import { uniq } from 'ramda'

import { connectToDatabase } from '@/lib/mongodb'
import { Spec } from '@/lib/types'
import { rejectNil } from '@/lib/utils'
import invariant from 'tiny-invariant'

const PUBLIC_USER_ID = 'user_2QaSdLhpL7dMcmD999SKB2teEIM'

async function connect() {
  const { db } = await connectToDatabase()
  return db.collection<OptionalUnlessRequiredId<Spec>>('spec')
}

export async function getSpecs(): Promise<Spec[]> {
  const { userId: id } = auth()
  const ids = uniq(rejectNil([id, PUBLIC_USER_ID]))
  const db = await connect()
  return await db
    .find({ userID: { $in: ids } }, { projection: { _id: false } })
    .toArray()
}

export async function getSpec(id: string): Promise<Spec> {
  const db = await connect()
  const spec: Spec[] = await db
    .find({ id }, { projection: { _id: false } })
    .toArray()
  invariant(spec?.length === 1, `Found multiple specs with id '${id}<`)
  return spec[0]
}

export async function updateSpec(spec: Spec) {
  const db = await connect()
  await db.updateOne({ id: spec.id }, { $set: spec })
}
