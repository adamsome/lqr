import { Aging, IngredientCategory, ProductionMethod } from '@/lib/consts'

export type IngredientDef = {
  id: string
  ordinal?: number
  name: string
  category: IngredientCategory
  parent?: string
  productionMethod?: ProductionMethod
  aging?: Aging
  origin?: string
  originTerritory?: string
  stock?: number
  buyPriority?: number
  references?: string[]
}

export type Ingredient = IngredientDef & {
  ancestors: IngredientDef[]
}
