import { HierarchicalFilter } from '@/app/lib/hierarchical-filter'
import { IngredientFilter } from '@/app/lib/ingredient/filter-ingredient-items'
import { IngredientKind } from '@/app/lib/ingredient/kind'
import { Ingredient } from '@/app/lib/types'

export const CABINETS = [
  'essentials',
  'tiki',
  'liquors',
  'liqueurs',
  'other',
] as const
export type CabinetID = (typeof CABINETS)[number]

export type BarCategory = IngredientFilter & {
  stocked: Ingredient[]
  allIDs: string[]
  topItems?: Ingredient[]
  root?: HierarchicalFilter
  rowSpan?: number
  bottlesOnly?: boolean
}

export type BarListCategoryDef = Partial<Omit<BarCategory, 'ingredients'>> & {
  ids?: string[]
  kind?: IngredientKind
}

export type CategoryKeys = {
  cabinet?: string
  shelf?: string
  category?: string
}

export type BarCategoryDef = Omit<BarListCategoryDef, 'name'> & {
  keys: CategoryKeys
  name: string
  colSpan?: number
  items?: number
  hideItems?: boolean
  hideGridItems?: boolean
  miscellaneous?: boolean
}

export type ShelfDef = {
  keys: CategoryKeys
  name: string
  gridCols?: number
  gridIDs: string[]
  listIDs: string[]
  flatList?: boolean
  children: Record<string, Omit<BarCategoryDef, keyof CategoryKeys | 'keys'>>
}

export type CabinetDef = {
  keys: CategoryKeys
  name: string
  gridIDs: string[]
  listIDs: string[]
  children: Record<string, Omit<ShelfDef, keyof CategoryKeys | 'keys'>>
}
