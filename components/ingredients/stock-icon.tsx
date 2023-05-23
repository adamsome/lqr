import { Button } from '@/components/ui/button'
import { cn } from '@/lib/util/cn'

type Props = {
  stock?: number
  header?: boolean
  fetching?: boolean
  onClick?: (stock: number) => void
}

function getNextStock(stock: number): number {
  return stock >= 0.75 ? 0.1 : 1
}

function getState(stock: number, fetching?: boolean): 'full' | 'low' | 'none' {
  let _stock = fetching ? getNextStock(stock) : stock
  if (_stock === -1) return 'none'
  if (_stock >= 0.75) return 'full'
  return 'low'
}

export function StockIcon({ stock = -1, header, fetching, onClick }: Props) {
  const state = getState(stock, fetching)

  const none = state === 'none'
  const full = state === 'full'
  const low = state === 'low'

  function handleClick() {
    onClick?.(getNextStock(stock))
  }

  return (
    <Button
      variant="ghost"
      className={cn('group h-8 w-8 p-0', {
        '-mr-2 hover:bg-transparent': header,
        'animate-pulse': fetching,
      })}
      onClick={handleClick}
    >
      <span className="sr-only">Change stock</span>
      <div
        className={cn('h-5 w-3.5 rounded-sm border p-0.5 transition', {
          'border-primary/50': header,
          'border-primary/30': none,
          'border-primary': !none,
          'group-hover:border-primary/50': !header,
        })}
      >
        <div className="flex h-full flex-col space-y-px">
          <div
            className={cn('flex-1 transition-colors duration-700', {
              'bg-primary': full,
              'group-hover:bg-primary/0': !fetching && full,
              'group-hover:bg-primary/30': !fetching && (none || low),
              'bg-primary/30': header,
            })}
          ></div>
          <div
            className={cn('flex-1 transition-colors duration-500', {
              'bg-primary': full,
              'group-hover:bg-primary/0': !fetching && full,
              'group-hover:bg-primary/30': !fetching && (none || low),
              'bg-primary/30': header,
            })}
          ></div>
          <div
            className={cn('flex-1 transition-colors', {
              'bg-primary': low || full,
              'group-hover:bg-primary/30': !fetching,
              'bg-primary/30': header,
            })}
          ></div>
        </div>
      </div>
    </Button>
  )
}
