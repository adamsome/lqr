import { Aging, Category, ProductionMethod } from '@/lib/generated-consts'
import { HierarchicalFilter } from '@/lib/hierarchical-filter'

export interface StaticData {
  baseIngredients: IngredientDef[]
  ingredients: Ingredient[]
  categoryFilter: HierarchicalFilter
  specs: Record<string, Spec>
}

export interface Data {
  baseIngredientDict: Record<string, IngredientDef>
  ingredientDict: Record<string, Ingredient>
  ingredientIDs: string[]
  categoryFilter: HierarchicalFilter
  specs: Record<string, Spec>
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
  username: string
  ingredients: Record<string, Partial<IngredientDef>>
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

export interface Spec {
  id: string
  name: string
  category: SpecCategory
  ingredients: SpecIngredient[]
  glass?: GlassType
  mix: MixType
  notes?: string
  source?: string
  sourcePage?: number
}

export type Option<T> = { label: string; value: T }
