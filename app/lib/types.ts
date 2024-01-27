import { PropsWithChildren } from 'react'

import { Aging, Category, ProductionMethod } from '@/app/lib/generated-consts'
import { GlassType } from '@/app/lib/glass-type'
import { HierarchicalFilter } from '@/app/lib/hierarchical-filter'
import { MixType } from '@/app/lib/mix-type'
import { SpecCategory } from '@/app/lib/spec-category'

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
  imageUrl?: string
}

export interface UserEntity {
  id: string
  username: string
  imageUrl?: string
  actedAt?: string
  ingredients?: Record<string, Partial<Ingredient>>
}

export interface Follow {
  follower: string
  followee: string
  followedAt: string
  follows: boolean
}

export interface Counts {
  specs: number
  bottles: number
  following: number
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
  type: 'bottle' | 'category' | 'custom' | 'ignore'
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
  notesHtml?: string
  bar?: string
  reference?: string
  referenceHtml?: string
  source?: string
  sourcePage?: number
  basis?: string
  stock?: SpecStock
}

export type IngredientSpecifier<T extends HasIDAndName = HasIDAndName> = {
  id?: string
  path?: string[]
  item?: T
}

export type CompProps = PropsWithChildren<{ className?: string }>
type SearchParam = string | string[] | undefined
type PropsWithSearchParams = { searchParams?: { [key: string]: SearchParam } }
export type LayoutProps<T = undefined> = T extends undefined
  ? PropsWithChildren
  : PropsWithChildren & { params?: T }
export type PageProps<T extends undefined | object = undefined> =
  T extends undefined
    ? PropsWithSearchParams
    : PropsWithSearchParams & { params?: Partial<T> }

export type HasIDAndName = { id: string; name: string }
export type Option<T> = { label: string; value: T }

export const BREAKPOINTS = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const

export type Breakpoint = (typeof BREAKPOINTS)[number]
