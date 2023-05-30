import { IngredientPathText } from '@/components/ingredients/ingredient-path-text'
import { useGetIngredientDefs } from '@/hooks/use-get-ingredient-defs'

type Props = {
  id: string
}

export function IngredientName({ id }: Props) {
  const getIngredientDefs = useGetIngredientDefs()
  const defs = getIngredientDefs(id)

  return <IngredientPathText path={defs.map((a) => a.id)} full />
}
