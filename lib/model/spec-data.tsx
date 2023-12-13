import { micromark } from 'micromark'
import invariant from 'tiny-invariant'

import { getSpecStock } from '@/lib/ingredient/get-spec-stock'
import { getIngredientData } from '@/lib/model/ingredient-data'
import { getSpec, getSpecs } from '@/lib/model/spec'
import { IngredientData, Spec, User } from '@/lib/types'

import { getFolloweeIDs } from '@/lib/model/follow'
import { getManyUsers } from '@/lib/model/user'
import { toIDMap } from '@/lib/utils'
import { auth } from '@clerk/nextjs'
import 'server-only'

export async function getSpecData(id: string): Promise<[Spec, IngredientData]> {
  const [data, spec] = await Promise.all([getIngredientData(), getSpec({ id })])
  const { dict, tree } = data

  invariant(spec, `No spec data for id '${id}'`)

  const getStock = getSpecStock(dict, tree)
  const enhancedSpec = { ...spec, stock: getStock(spec) }
  if (spec.notes) {
    enhancedSpec.notesHtml = micromark(spec.notes)
  }
  if (spec.reference) {
    enhancedSpec.referenceHtml = micromark(`—${spec.reference}`)
  }
  return [enhancedSpec, data]
}

export async function getAllSpecsData(userID: string): Promise<{
  specs: Spec[]
  userDict: Record<string, User>
  data: IngredientData
}> {
  const { userId: currentUserID } = auth()

  const userIDs = [userID]
  if (userID === currentUserID) {
    const followees = await getFolloweeIDs(userID)
    userIDs.push(...followees)
  }

  const users = await getManyUsers(userIDs)
  const userDict = toIDMap(users, (u) => u.username)

  const [data, rawSpecs] = await Promise.all([
    getIngredientData(),
    getSpecs(userIDs),
  ])
  const { dict, tree } = data

  const getStock = getSpecStock(dict, tree)
  const specs = rawSpecs.map((spec) => ({ ...spec, stock: getStock(spec) }))

  return { specs, userDict, data }
}
