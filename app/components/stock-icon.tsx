import { StockState } from '@/app/lib/stock'
import { cn } from '@/app/lib/utils'

type Props = {
  stock?: StockState
  header?: boolean
  disabled?: boolean
}

export function StockIcon({ stock = 'none', header, disabled }: Props) {
  const none = stock === 'none'
  const full = stock === 'full'
  const low = stock === 'low'

  return (
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
            'group-hover:bg-primary/0': !disabled && full,
            'group-hover:bg-primary/30': !disabled && (none || low),
            'bg-primary/30': header,
          })}
        ></div>
        <div
          className={cn('flex-1 transition-colors duration-500', {
            'bg-primary': full,
            'group-hover:bg-primary/0': !disabled && full,
            'group-hover:bg-primary/30': !disabled && (none || low),
            'bg-primary/30': header,
          })}
        ></div>
        <div
          className={cn('flex-1 transition-colors', {
            'bg-primary': low || full,
            'group-hover:bg-primary/30': !disabled,
            'bg-primary/30': header,
          })}
        ></div>
      </div>
    </div>
  )
}
