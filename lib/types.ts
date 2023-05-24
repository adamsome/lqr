import { Aging, Category, ProductionMethod } from '@/lib/consts'

export interface IngredientDef {
  id: string
  ordinal?: number
  name: string
  category: Category
  parent?: string
  productionMethod?: ProductionMethod
  aging?: Aging
  black?: boolean
  overproof?: boolean
  origin?: string
  originTerritory?: string
  stock?: number
  buyPriority?: number
  references?: string[]
}

export type Ingredient = IngredientDef & {
  ancestors: IngredientDef[]
}

export interface User {
  username: string
  ingredients: Record<string, Partial<IngredientDef>>
}
