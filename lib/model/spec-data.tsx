import { sortBy } from 'ramda'

import { getSpecStock } from '@/lib/ingredient/get-spec-stock'
import { getIngredientData } from '@/lib/model/ingredient-data'
import { getSpec, getSpecs } from '@/lib/model/spec'
import { IngredientData, Spec } from '@/lib/types'

import 'server-only'

export async function getSpecData(id: string): Promise<[Spec, IngredientData]> {
  const [data, spec] = await Promise.all([getIngredientData(), getSpec(id)])
  const { dict, tree } = data

  const getStock = getSpecStock(dict, tree)
  return [{ ...spec, stock: getStock(spec) }, data]
}

export async function getAllSpecsData(): Promise<[Spec[], IngredientData]> {
  const [data, rawSpecs] = await Promise.all([getIngredientData(), getSpecs()])
  const { dict, tree } = data

  const getStock = getSpecStock(dict, tree)
  const specs = sortBy(
    (s) => -(s.stock?.count ?? 0) / (s.stock?.total ?? 0),
    rawSpecs.map((spec) => ({ ...spec, stock: getStock(spec) }))
  )

  return [specs, data]
}
