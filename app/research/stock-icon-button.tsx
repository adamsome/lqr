import { StockIcon } from '@/components/stock-icon'
import { Button } from '@/components/ui/button'
import { getNextStockValue, getStockState } from '@/lib/stock'
import { cn } from '@/lib/utils'

type Props = {
  stock?: number
  fetching?: boolean
  onClick?: (stock: number) => void
}

export function StockIconButton({ stock = -1, fetching, onClick }: Props) {
  const state = getStockState(stock, fetching)

  function handleClick() {
    !fetching && onClick?.(getNextStockValue(stock))
  }

  return (
    <Button
      variant="ghost"
      className={cn('group h-8 w-8 p-0', {
        'animate-pulse': fetching,
      })}
      disabled={fetching}
      onClick={handleClick}
    >
      <span className="sr-only">Change stock</span>
      <StockIcon stock={state} disabled={fetching} />
    </Button>
  )
}
