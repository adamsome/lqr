'use client'

import { StockIconButton } from '@/app/research/stock-icon-button'
import { useMutate } from '@/hooks/use-mutate'

type Props = {
  ingredientID: string
  stock?: number
}

export function StockCell({ ingredientID, stock = -1 }: Props) {
  const [mutating, mutate] = useMutate('/api/stock', stock)

  async function handleClick(stockToSet: number) {
    await mutate({
      method: 'PUT',
      body: JSON.stringify({
        ingredientID,
        stock: stockToSet,
      }),
    })
  }

  return (
    <StockIconButton stock={stock} fetching={mutating} onClick={handleClick} />
  )
}
