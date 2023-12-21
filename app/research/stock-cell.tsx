'use client'

import { StockIconButton } from '@/app/research/stock-icon-button'
import { useMutateStock } from '@/lib/api/use-mutate-stock'

type Props = {
  ingredientID: string
  stock?: number
}

export function StockCell({ ingredientID, stock = -1 }: Props) {
  const { mutating, mutate } = useMutateStock({ watchData: stock })

  async function handleClick(stockToSet: number) {
    await mutate(ingredientID, stockToSet)
  }

  return (
    <StockIconButton stock={stock} fetching={mutating} onClick={handleClick} />
  )
}
