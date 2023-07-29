import { getIngredientView } from '@/lib/ingredient/get-ingredient-view'
import {
  IngredientData,
  SpecIngredient,
  SpecIngredientStock,
} from '@/lib/types'
import { cn } from '@/lib/utils'

type Props = {
  data: IngredientData
  ingredient: SpecIngredient
  stock?: SpecIngredientStock
}

export function Ingredient({ data, ingredient, stock }: Props) {
  const { dict } = data
  const { amount, category, name } = getIngredientView(dict, ingredient)
  const notInStock = !stock || stock.stock <= 0
  const categoryMatch =
    !notInStock && stock.type === 'category' && ingredient.bottleID
  const missing = notInStock && stock?.type !== 'custom'
  const custom = notInStock && stock?.type === 'custom'
  return (
    <div
      className={cn(
        '-ms-2 flex flex-col items-start border-l-2 border-transparent ps-1.5 leading-snug',
        { 'border-red-400 opacity-60': missing },
        { 'border-sky-300 opacity-80': categoryMatch },
        { 'border-muted-foreground/60 opacity-80': custom }
      )}
    >
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
