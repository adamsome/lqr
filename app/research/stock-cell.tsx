'use client'

import { StockIconButton } from '@/app/research/stock-icon-button'
import { useRefresh } from '@/hooks/use-refresh'

type Props = {
  ingredientID: string
  stock?: number
}

export function StockCell({ ingredientID, stock = -1 }: Props) {
  const { refresh, fetching } = useRefresh(stock)

  async function handleClick(stockToSet: number) {
    await fetch('/api/stock', {
      method: 'PUT',
      body: JSON.stringify({
        ingredientID,
        stock: stockToSet,
      }),
    })
    refresh()
  }

  return (
    <StockIconButton stock={stock} fetching={fetching} onClick={handleClick} />
  )
}
