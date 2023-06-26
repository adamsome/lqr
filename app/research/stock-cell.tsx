'use client'

import { StockIconButton } from '@/app/research/stock-icon-button'
import { useMutate } from '@/hooks/use-mutate'

type Props = {
  ingredientID: string
  stock?: number
}

export function StockCell({ ingredientID, stock = -1 }: Props) {
  const [fetching, fetch] = useMutate('/api/stock', stock)

  async function handleClick(stockToSet: number) {
    await fetch({
      method: 'PUT',
      body: JSON.stringify({
        ingredientID,
        stock: stockToSet,
      }),
    })
  }

  return (
    <StockIconButton stock={stock} fetching={fetching} onClick={handleClick} />
  )
}
