import { curry } from 'ramda'

import { getSpecAmountName } from '@/app/lib/ingredient/get-amount-name'
import { getIngredientName } from '@/app/lib/ingredient/get-ingredient-name'
import { Ingredient, SpecIngredient } from '@/app/lib/types'
import { capitalize } from '@/app/lib/utils'

export const getIngredientView = curry(
  (dict: Record<string, Ingredient>, ingredient: SpecIngredient) => {
    const getName = getIngredientName(dict)

    const amount = getSpecAmountName(ingredient)
    let category
    let name = getName(ingredient, { toLower: true })
    let infusion: string | undefined
    let error: string | undefined

    if (!amount[0]) name = capitalize(name)

    if (ingredient.bottleID) {
      category = capitalize(name)
      const def = dict[ingredient.bottleID]
      if (!def) {
        error = `No ingredient found for ID '${
          ingredient.bottleID ?? ingredient.id ?? 'Unknown'
        }'.`
        console.warn(error)
      } else {
        name = dict[ingredient.bottleID].name
        if (ingredient.infusion) {
          infusion = `${capitalize(ingredient.infusion)}-infused`
        }
      }
    }
    return { amount, category, name, infusion, error }
  },
)
