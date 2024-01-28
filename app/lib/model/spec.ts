import { Filter, OptionalId, OptionalUnlessRequiredId } from 'mongodb'
import invariant from 'tiny-invariant'

import { updateUserSpecCount } from '@/app/lib/model/user'
import { FIND_NO_ID, connectToDatabase } from '@/app/lib/mongodb'
import { Spec } from '@/app/lib/types'
import { asArray } from '@/app/lib/utils'

import 'server-only'
import { cache } from 'react'

const connect = async () =>
  connectToDatabase().then(({ db }) =>
    db.collection<OptionalUnlessRequiredId<Spec>>('spec'),
  )

export const getSpec = cache(
  async (
    id: string | undefined,
    userID: string | undefined,
  ): Promise<Spec | undefined> => {
    if (!id || !userID) return undefined
    const cn = await connect()
    const specs: Spec[] = await cn.find({ id }, FIND_NO_ID).toArray()
    invariant(specs.length <= 1, `Got multiple specs`)
    return specs[0]
  },
)

export const getAllSpecs = cache(
  async (userID: string | undefined): Promise<Spec[]> => {
    if (!userID) return []
    const cn = await connect()
    return cn.find({ userID }, FIND_NO_ID).toArray()
  },
)

export const getSpecCount = cache(async (userID: string) =>
  getAllSpecs(userID).then((specs) => specs.length),
)

export async function getAllSpecsWithUserIDs(
  userIDOrIDs: string[],
): Promise<Spec[]> {
  const userIDs = asArray(userIDOrIDs)
  if (userIDs.length === 0) return []
  if (userIDs.length === 1) {
    return getAllSpecs(userIDOrIDs[0])
  }
  const cn = await connect()
  return cn.find({ userID: { $in: userIDs } }, FIND_NO_ID).toArray()
}

export async function updateSpec(spec: Spec) {
  const cn = await connect()
  return cn.updateOne({ id: spec.id }, { $set: spec })
}

async function updateSpecCount(userID: string | null, delta: number) {
  if (!userID) return
  const count = await getSpecCount(userID)
  await updateUserSpecCount(userID, count + delta)
}

export async function addSpec(spec: Spec) {
  const cn = await connect()
  await updateSpecCount(spec.userID, 1)
  return cn.insertOne(spec)
}

export async function deleteSpec(filter: Filter<OptionalId<Spec>>) {
  const cn = await connect()
  const userID = typeof filter.userID === 'string' ? filter.userID : null
  await updateSpecCount(userID, -1)
  return cn.deleteOne(filter)
}
