import { useIngredientData } from '@/components/data-provider'
import { useGetIngredientName } from '@/hooks/use-get-ingredient-name'
import { getSpecAmountName } from '@/lib/ingredient/get-amount-name'
import { SpecIngredient } from '@/lib/types'
import { capitalize } from '@/lib/utils'

export function useIngredientName(ingredient: SpecIngredient) {
  const { dict } = useIngredientData()
  const getIngredientName = useGetIngredientName()

  const amount = getSpecAmountName(ingredient)

  let category
  let name = getIngredientName(ingredient, { toLower: true })
  if (!amount[0]) name = capitalize(name)

  const { bottleID } = ingredient
  if (bottleID) {
    category = capitalize(name)
    name = dict[bottleID].name
  }
  return { amount, category, name }
}
