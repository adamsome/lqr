import { getSpecAmountName } from '@/lib/ingredient/get-amount-name'
import { getIngredientName } from '@/lib/ingredient/get-ingredient-name'
import { Ingredient, SpecIngredient } from '@/lib/types'
import { capitalize } from '@/lib/utils'

export function getIngredientView(
  dict: Record<string, Ingredient>,
  ingredient: SpecIngredient
) {
  const getName = getIngredientName(dict)

  const amount = getSpecAmountName(ingredient)

  let category
  let name = getName(ingredient, { toLower: true })
  if (!amount[0]) name = capitalize(name)

  const { bottleID } = ingredient
  if (bottleID) {
    category = capitalize(name)
    name = dict[bottleID].name
  }
  return { amount, category, name }
}
