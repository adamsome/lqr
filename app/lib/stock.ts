import { sortBy } from 'ramda'

import { Ingredient } from '@/app/lib/types'

export type StockState = 'full' | 'low' | 'none'

export function getNextStockValue(stock: number): number {
  return stock >= 0.75 ? 0.1 : 1
}

export function getStockStateValue(stock: StockState): number {
  switch (stock) {
    case 'full':
      return 1
    case 'low':
      return 0.1
    case 'none':
      return -1
  }
}

export function getStockState(stock = -1, fetching?: boolean): StockState {
  let _stock = fetching ? getNextStockValue(stock) : stock
  if (_stock === -1) return 'none'
  if (_stock >= 0.75) return 'full'
  return 'low'
}

export function getStockLabel(state: StockState): string {
  switch (state) {
    case 'full':
      return 'Full'
    case 'low':
      return 'Low'
    case 'none':
      return 'Empty'
  }
}

export const isStockedBottle =
  (dict: Record<string, Ingredient>) =>
  (id: string): boolean =>
    dict[id]?.ordinal !== undefined && (dict[id]?.stock ?? -1) > 0

export const getStockedBottleCount = (dict: Record<string, Ingredient>) =>
  Object.keys(dict).filter(isStockedBottle(dict)).length

export const sortByStocked = sortBy(({ stock = -1 }: Ingredient) => -stock)
