import { SpecIngredientStock } from '@/lib/types'

export const isSpecIngredientStockIgnorable = (
  stock?: SpecIngredientStock | null,
) => stock != null && ['custom', 'ignore'].includes(stock.type)
