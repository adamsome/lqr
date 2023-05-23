'use client'

import { StockIcon } from '@/components/ingredients/stock-icon'
import { useRefresh } from '@/hooks/use-refresh'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type Props = {
  ingredientID: string
  stock?: number
}

export function StockCell({ ingredientID, stock = -1 }: Props) {
  const { refresh, fetching } = useRefresh(stock)

  async function handleClick(stockToSet: number) {
    console.log('click', ingredientID, stock)
    await fetch('/api/stock', {
      method: 'PUT',
      body: JSON.stringify({
        ingredientID,
        stock: stockToSet,
      }),
    })
    refresh()
  }

  return <StockIcon stock={stock} fetching={fetching} onClick={handleClick} />
}
