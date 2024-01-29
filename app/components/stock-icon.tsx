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
      className={cn(
        'h-5 w-3.5 rounded-sm border p-0.5 transition',
        header ? 'border-primary/50' : 'group-hover:border-primary/50',
        none ? 'border-primary/30' : 'border-primary',
      )}
    >
      <div className="flex h-full flex-col space-y-px">
        <div
          className={cn(
            'flex-1 transition-colors duration-700',
            full && 'bg-primary',
            !disabled && full && 'group-hover:bg-primary/0',
            !disabled && (none || low) && 'group-hover:bg-primary/30',
            header && 'bg-primary/30',
          )}
        ></div>
        <div
          className={cn(
            'flex-1 transition-colors duration-500',
            full && 'bg-primary',
            !disabled && full && 'group-hover:bg-primary/0',
            !disabled && (none || low) && 'group-hover:bg-primary/30',
            header && 'bg-primary/30',
          )}
        ></div>
        <div
          className={cn(
            'flex-1 transition-colors',
            (low || full) && 'bg-primary',
            !disabled && 'group-hover:bg-primary/30',
            header && 'bg-primary/30',
          )}
        ></div>
      </div>
    </div>
  )
}
