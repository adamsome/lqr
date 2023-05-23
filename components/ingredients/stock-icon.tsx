import { Button } from '@/components/ui/button'
import { cn } from '@/lib/util/cn'

type Props = {
  stock?: number
  header?: boolean
}

export function StockIcon({ stock = -1, header }: Props) {
  const none = stock === -1
  const full = stock >= 0.75
  const low = stock > 0 && !full
  return (
    <Button
      variant="ghost"
      className={cn('group h-8 w-8 p-0', {
        '-mr-2 hover:bg-transparent': header,
      })}
    >
      <span className="sr-only">Change stoc</span>
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
              'bg-primary group-hover:bg-primary/0': full,
              'group-hover:bg-primary/30': none || low,
              'bg-primary/30': header,
            })}
          ></div>
          <div
            className={cn('flex-1 transition-colors duration-500', {
              'bg-primary group-hover:bg-primary/0': full,
              'group-hover:bg-primary/30': none || low,
              'bg-primary/30': header,
            })}
          ></div>
          <div
            className={cn('flex-1 transition-colors', {
              'bg-primary group-hover:bg-primary/30': low || full,
              'group-hover:bg-primary/30': none,
              'bg-primary/30': header,
            })}
          ></div>
        </div>
      </div>
    </Button>
  )
}
