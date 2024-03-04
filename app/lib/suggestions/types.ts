import { SpecIngredient } from '@/app/lib/types'
import { CategoryKeys } from '@/app/u/[username]/bar/lib/types'

export type IngredientSuggestionItem = CategoryKeys & {
  id?: string
  bottleID?: string
  ingredient: SpecIngredient
}

export type IngredientSuggestion = {
  items: IngredientSuggestionItem[]
  exactCount: number
  subsetCount: number
}
