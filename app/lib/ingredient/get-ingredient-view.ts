import { getSpecAmountName } from '@/app/lib/ingredient/get-amount-name'
import { getIngredientName } from '@/app/lib/ingredient/get-ingredient-name'
import { Ingredient, SpecIngredient } from '@/app/lib/types'
import { capitalize } from '@/app/lib/utils'
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
