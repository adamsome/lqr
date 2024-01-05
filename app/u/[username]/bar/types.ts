import { HierarchicalFilter } from '@/lib/hierarchical-filter'
import { IngredientFilter } from '@/lib/ingredient/filter-ingredient-items'
import { IngredientKind } from '@/lib/ingredient/kind'
import { Ingredient } from '@/lib/types'

export type BarCategory = IngredientFilter & {
  stocked: Ingredient[]
  topItems?: Ingredient[]
  root?: HierarchicalFilter
  rowSpan?: number
}

export type BarCategoryDef = Partial<Omit<BarCategory, 'ingredients'>> & {
  ids?: string[]
  kind?: IngredientKind
}
