import { StockIcon } from '@/app/components/stock-icon'
import { Button } from '@/app/components/ui/button'
import { getNextStockValue, getStockState } from '@/app/lib/stock'
import { cn } from '@/app/lib/utils'

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
      onClick={handleClick}
    >
      <span className="sr-only">Change stock</span>
      <StockIcon stock={state} disabled={fetching} />
    </Button>
  )
}
