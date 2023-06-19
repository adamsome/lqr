import { useIngredientName } from '@/hooks/use-ingredient-name'
import { SpecIngredient } from '@/lib/types'

type Props = {
  ingredient: SpecIngredient
}

export function Ingredient({ ingredient }: Props) {
  const { amount, category, name } = useIngredientName(ingredient)
  return (
    <div className="flex flex-col items-start leading-snug">
      {category && (
        <div className="text-xs leading-none text-muted-foreground">
          {category}
        </div>
      )}
      <div className="inline-block">
        {amount[0] && (
          <span className="font-semibold text-popover-foreground">{`${amount[0]} `}</span>
        )}
        <span>{name}</span>
        {amount[1] && <span>{` ${amount[1]}`}</span>}
      </div>
    </div>
  )
}
