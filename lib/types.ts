import { Aging, Category, ProductionMethod } from '@/lib/generated-consts'
import { HierarchicalFilter } from '@/lib/hierarchical-filter'

export interface StaticData {
  baseIngredients: IngredientDef[]
  ingredients: Ingredient[]
  categoryFilter: HierarchicalFilter
}

export interface Data {
  baseIngredientDict: Record<string, IngredientDef>
  ingredientDict: Record<string, Ingredient>
  ingredientIDs: string[]
  categoryFilter: HierarchicalFilter
  specs: Spec[]
}

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
  id: string
  username: string
  ingredients: Record<string, Partial<IngredientDef>>
  admin?: boolean
}

export type Unit = 'oz' | 'tsp' | 'dash' | 'cube'
export type Usage =
  | 'rim'
  | 'twist'
  | 'grated'
  | 'wheel'
  | 'wedge'
  | 'whole'
  | 'float'
  | 'top'
  | 'rinse'
  | 'muddled'
export type SpecCategory = 'tiki' | 'highball' | 'daiquiri'
export type GlassType = 'coupe' | 'rocks' | 'highball'
export type MixType = 'stirred' | 'shaken'

export type Amount = {
  quantity?: number
  unit?: Unit
  usage?: Usage
}

export interface SpecIngredient extends Amount {
  id?: string
  bottleID?: string
  name?: string
  productionMethod?: ProductionMethod
  aging?: Aging[]
  black?: boolean
  overproof?: boolean
  infusion?: string
}

export interface SpecIngredientStock {
  type: 'bottle' | 'categoryBottle' | 'category' | 'custom'
  stock: number
  bottles?: { id: string; stock: number }[]
}

export interface SpecStock {
  count: number
  total: number
  ingredients: SpecIngredientStock[]
}

export interface Spec {
  id: string
  name: string
  userID: string
  username: string
  updatedAt: string
  createdAt: string
  year: number
  category: SpecCategory
  ingredients: SpecIngredient[]
  glass?: GlassType
  mix?: MixType
  notes?: string
  author?: string
  bar?: string
  source?: string
  sourcePage?: number
  stock?: SpecStock
}

export type Option<T> = { label: string; value: T }
