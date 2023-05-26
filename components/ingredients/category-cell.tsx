import { CategoryText } from '@/components/ingredients/category-text'
import { CATEGORY_DICT } from '@/lib/consts'
import { Ingredient } from '@/lib/types'

type Props = {
  ingredient: Ingredient
}

export function CategoryCell({ ingredient }: Props) {
  const { category, ancestors } = ingredient
  const categoryItem = {
    id: category as string,
    name: CATEGORY_DICT[category].name,
  }
  const items = [categoryItem].concat(
    ancestors.map(({ id, name }) => ({ id, name }))
  )
  return <CategoryText items={items} />
}
