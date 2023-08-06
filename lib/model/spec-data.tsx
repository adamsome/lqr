import { sortBy } from 'ramda'

import { getSpecStock } from '@/lib/ingredient/get-spec-stock'
import { getIngredientData } from '@/lib/model/ingredient-data'
import { getSpec, getSpecs } from '@/lib/model/spec'
import { IngredientData, Spec, User } from '@/lib/types'

import 'server-only'

export async function getSpecData(id: string): Promise<[Spec, IngredientData]> {
  const [data, spec] = await Promise.all([getIngredientData(), getSpec(id)])
  const { dict, tree } = data

  const getStock = getSpecStock(dict, tree)
  return [{ ...spec, stock: getStock(spec) }, data]
}

export async function getAllSpecsData(): Promise<{
  specs: Spec[]
  userDict: Record<string, User>
  data: IngredientData
}> {
  const [data, specsData] = await Promise.all([getIngredientData(), getSpecs()])
  const { dict, tree } = data
  const { specs, userDict } = specsData

  const getStock = getSpecStock(dict, tree)
  const sortedSpecs = sortBy(
    (s) => -(s.stock?.count ?? 0) / (s.stock?.total ?? 0),
    specs.map((spec) => ({ ...spec, stock: getStock(spec) })),
  )

  return { specs: sortedSpecs, userDict, data }
}
