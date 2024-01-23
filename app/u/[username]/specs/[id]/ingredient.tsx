import { complement } from 'ramda'

import { getIngredientView } from '@/app/lib/ingredient/get-ingredient-view'
import { isSpecIngredientStockIgnorable } from '@/app/lib/ingredient/spec-ingredient-stock'
import {
  IngredientData,
  SpecIngredient,
  SpecIngredientStock,
} from '@/app/lib/types'
import { cn } from '@/app/lib/utils'

type Props = {
  data: IngredientData
  ingredient: SpecIngredient
  stock?: SpecIngredientStock
  showStock?: boolean
}

export function Ingredient({ data, ingredient, stock, showStock }: Props) {
  const { dict } = data
  const { bottleID } = ingredient
  const { amount, category, name, infusion } = getIngredientView(
    dict,
    ingredient,
  )
  const notInStock = !stock || stock.stock <= 0
  const categoryMatch = !notInStock && stock.type === 'category' && bottleID
  const missing =
    notInStock && complement(isSpecIngredientStockIgnorable)(stock)
  const ignorable = notInStock && isSpecIngredientStockIgnorable(stock)
  return (
    <div
      className={cn(
        '-ms-2 flex flex-col items-start border-l-2 border-transparent ps-1.5 leading-snug',
        { 'border-red-400 opacity-60': showStock && missing },
        { 'border-sky-300 opacity-80': showStock && categoryMatch },
        { 'border-muted-foreground/60 opacity-80': showStock && ignorable },
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
        {infusion && <span>{infusion} </span>}
        <span>{name}</span>
        {amount[1] && <span>{` ${amount[1]}`}</span>}
      </div>
    </div>
  )
}
