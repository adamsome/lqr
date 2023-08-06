import { Aging, Category, ProductionMethod } from '@/lib/generated-consts'
import { GlassType } from '@/lib/glass-type'
import { HierarchicalFilter } from '@/lib/hierarchical-filter'
import { MixType } from '@/lib/mix-type'
import { SpecCategory } from '@/lib/spec-category'

export interface StaticData {
  baseIngredients: Ingredient[]
  ingredients: Ingredient[]
  tree: HierarchicalFilter
}

export interface IngredientData {
  dict: Record<string, Ingredient>
  tree: HierarchicalFilter
}

export interface Ingredient {
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

export type WithPath<T> = T & { path: string[] }

export interface User {
  id: string
  username: string
  displayName?: string
  ingredients?: Record<string, Partial<Ingredient>>
  admin?: boolean
}

export interface Follow {
  follower: string
  followee: string
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
  type: 'bottle' | 'category' | 'custom'
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
  userDisplayName?: string
  updatedAt: string
  createdAt: string
  year: number
  category: SpecCategory
  ingredients: SpecIngredient[]
  glass?: GlassType
  mix?: MixType
  notes?: string
  bar?: string
  source?: string
  sourcePage?: number
  stock?: SpecStock
}

export type IngredientSpecifier<T extends HasIDAndName = HasIDAndName> = {
  id?: string
  path?: string[]
  item?: T
}

export type HasIDAndName = { id: string; name: string }
export type Option<T> = { label: string; value: T }
