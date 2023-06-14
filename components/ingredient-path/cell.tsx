import { IngredientPathText } from '@/components/ingredient-path/text'
import { CATEGORY_DICT } from '@/lib/generated-consts'
import { Ingredient } from '@/lib/types'

type Props = {
  ingredient: Ingredient
}

export function IngredientPathCell({ ingredient }: Props) {
  const { category, ancestors } = ingredient
  const categoryItem = {
    id: category as string,
    name: CATEGORY_DICT[category].name,
  }
  const items = [categoryItem].concat(
    ancestors.map(({ id, name }) => ({ id, name }))
  )
  return (
    <IngredientPathText
      path={[category, ...ancestors.map(({ id }) => id)]}
      full
    />
  )
}
