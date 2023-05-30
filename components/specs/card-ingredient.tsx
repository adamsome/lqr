import { useCategoryMeta } from '@/components/category-meta-provider'
import { IngredientName } from '@/components/specs/ingredient-name'
import { SpecIngredient } from '@/lib/types'

type Props = {
  ingredient: SpecIngredient
}

export function CardIngredient({ ingredient }: Props) {
  const { baseIngredientDict, ingredientDict } = useCategoryMeta()
  const { id, bottleID, name } = ingredient
  let baseName: string | undefined
  let ingredientName: string | undefined
  if (id) {
    baseName = baseIngredientDict[id].name
  }
  if (bottleID) {
    ingredientName = ingredientDict[bottleID].name
  }
  const displayName = baseName ?? name ?? ''
  return (
    <div className="leading-snug">
      {id && <IngredientName id={id} />}
      {ingredientName && <span> ({ingredientName})</span>}
    </div>
  )
}
