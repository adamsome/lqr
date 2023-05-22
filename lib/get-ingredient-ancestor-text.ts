import { CATEGORY_DICT } from '@/lib/consts'
import { Ingredient } from '@/lib/types'

export function getIngredientAncestorText(ingredient: Ingredient) {
  const { category, ancestors } = ingredient
  const categoryPrefix = `${CATEGORY_DICT[category].name}, `
  const ancestorNames = ancestors.map((a) => a.name).join(', ')
  return categoryPrefix + ancestorNames
}
