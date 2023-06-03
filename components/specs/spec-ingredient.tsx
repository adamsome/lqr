import { useData } from '@/components/category-meta-provider'
import { useGetIngredientName } from '@/hooks/use-get-ingredient-name'
import { SpecIngredient } from '@/lib/types'
import { capitalize } from '@/lib/utils'

type Props = {
  ingredient: SpecIngredient
}

export function SpecIngredient({ ingredient }: Props) {
  const { ingredientDict } = useData()
  const getIngredientName = useGetIngredientName()

  const name = getIngredientName(ingredient)

  const { bottleID } = ingredient
  let bottleName = ''
  if (bottleID) {
    bottleName = ingredientDict[bottleID].name
  }

  return (
    <div className="leading-snug">
      {bottleName ? (
        <div className="leading-none">
          <div className="text-xs text-muted-foreground">
            {capitalize(name)}
          </div>
          <span className="leading-snug">{bottleName}</span>
        </div>
      ) : (
        <div>{capitalize(name)}</div>
      )}
    </div>
  )
}
