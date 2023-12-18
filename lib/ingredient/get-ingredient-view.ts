import { getSpecAmountName } from '@/lib/ingredient/get-amount-name'
import { getIngredientName } from '@/lib/ingredient/get-ingredient-name'
import { Ingredient, SpecIngredient } from '@/lib/types'
import { capitalize } from '@/lib/utils'
import { curry } from 'ramda'

export const getIngredientView = curry(
  (dict: Record<string, Ingredient>, ingredient: SpecIngredient) => {
    const getName = getIngredientName(dict)

    const amount = getSpecAmountName(ingredient)
    let category
    let name = getName(ingredient, { toLower: true })
    let infusion: string | undefined

    if (!amount[0]) name = capitalize(name)

    if (ingredient.bottleID) {
      category = capitalize(name)
      name = dict[ingredient.bottleID].name
      if (ingredient.infusion) {
        infusion = `${capitalize(ingredient.infusion)}-infused`
      }
    }
    return { amount, category, name, infusion }
  },
)
