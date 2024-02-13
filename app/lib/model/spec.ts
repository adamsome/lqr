import { Filter, OptionalId, OptionalUnlessRequiredId } from 'mongodb'
import { cache } from 'react'
import invariant from 'tiny-invariant'

import { updateUserSpecCount } from '@/app/lib/model/user'
import { FIND_NO_ID, connectToDatabase } from '@/app/lib/mongodb'
import { Spec, type User } from '@/app/lib/types'
import { asArray } from '@/app/lib/utils'

import 'server-only'

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

export async function updateSpecUser(id: string, userID: string, user: User) {
  const cn = await connect()
  const $set: Partial<Spec> = { userID: user.id, username: user.username }
  if (user.displayName) $set.userDisplayName = user.displayName
  return cn.updateOne({ id, userID }, { $set })
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
