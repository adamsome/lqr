import { Aging, Category, ProductionMethod } from '@/lib/consts'
import { CheckedState } from '@radix-ui/react-checkbox'

export type IngredientDef = {
  id: string
  ordinal?: number
  name: string
  category: Category
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
