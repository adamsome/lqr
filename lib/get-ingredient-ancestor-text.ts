import { IngredientCategoryDefs } from '@/lib/consts'
import { Ingredient } from '@/lib/ingredient'

export function getIngredientAncestorText(ingredient: Ingredient) {
  const { category, ancestors } = ingredient
  const categoryPrefix = `${IngredientCategoryDefs[category].name}, `
  const ancestorNames = ancestors.map((a) => a.name).join(', ')
  return categoryPrefix + ancestorNames
}
