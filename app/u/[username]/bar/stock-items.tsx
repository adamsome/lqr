import { StockIcon } from '@/components/stock-icon'
import { CommandGroup, CommandItem } from '@/components/ui/command'
import { useMutateStock } from '@/lib/api/use-mutate-stock'
import {
  StockState,
  getStockLabel,
  getStockState,
  getStockStateValue,
} from '@/lib/stock'
import { Ingredient } from '@/lib/types'

type Props = {
  ingredient: Ingredient
  onComplete(): void
}

export function StockItems({ ingredient, onComplete }: Props) {
  const stock = getStockState(ingredient.stock)
  const { mutating, mutate } = useMutateStock({ watchData: ingredient.stock })

  async function handleClick(stock: StockState) {
    await mutate(ingredient.id, getStockStateValue(stock))
    onComplete()
  }

  return (
    <CommandGroup heading="Stock">
      <Item
        stock={stock === 'full' ? 'low' : 'full'}
        fetching={mutating}
        onClick={handleClick}
      />
      <Item stock="none" fetching={mutating} onClick={handleClick} />
    </CommandGroup>
  )
}

type ItemProps = {
  stock: StockState
  fetching?: boolean
  onClick(stock: StockState): void
}

function Item({ stock, fetching, onClick }: ItemProps) {
  return (
    <CommandItem
      className="flex items-center gap-2 overflow-hidden"
      disabled={fetching}
      onSelect={() => onClick(stock)}
    >
      <div className="scale-[.8] transform opacity-60">
        <StockIcon stock={stock} />
      </div>
      <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
        {stock === 'none'
          ? 'Remove from Bar'
          : `Mark as ${getStockLabel(stock)}`}
      </span>
    </CommandItem>
  )
}
