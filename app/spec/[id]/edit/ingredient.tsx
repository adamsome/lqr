import { useData } from '@/components/data-provider'
import { useGetIngredientName } from '@/hooks/use-get-ingredient-name'
import { getSpecAmountName } from '@/lib/ingredient/get-amount-name'
import { SpecIngredient } from '@/lib/types'
import { capitalize } from '@/lib/utils'

type Props = {
  ingredient: SpecIngredient
}

export function Ingredient({ ingredient }: Props) {
  const { ingredientDict } = useData()
  const getIngredientName = useGetIngredientName()

  const amount = getSpecAmountName(ingredient)

  let category = ''
  let name = getIngredientName(ingredient).toLocaleLowerCase()
  if (!amount[0]) name = capitalize(name)

  const { bottleID } = ingredient
  if (bottleID) {
    category = capitalize(name)
    name = ingredientDict[bottleID].name
  }

  return (
    <div className="leading-snug">
      {category && (
        <div className="text-xs leading-none text-muted-foreground">
          {category}
        </div>
      )}
      <div className="flex items-baseline gap-1.5">
        {amount[0] && <span>{amount[0]}</span>}
        <span>{name}</span>
        {amount[1] && <span>{amount[1]}</span>}
      </div>
    </div>
  )
}
