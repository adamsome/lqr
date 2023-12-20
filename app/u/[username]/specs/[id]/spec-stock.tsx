import { CircleProgress } from '@/components/ui/circle-progress'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { SpecStock } from '@/lib/types'
import { cn } from '@/lib/utils'

type Props = {
  className?: string
  stock?: SpecStock
}

export function SpecStock({ className, stock }: Props) {
  const { count = 0, total = 0 } = stock ?? {}
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div>
          <CircleProgress
            className={cn('w-4 text-muted-foreground', className)}
            value={count}
            total={total}
          />
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <SpecStockText stock={stock} />
      </TooltipContent>
    </Tooltip>
  )
}

export function SpecStockText({ className, stock }: Props) {
  const { count = 0, total = 0 } = stock ?? {}
  return (
    <div
      className={cn(
        'flex items-center gap-1 text-muted-foreground/60 font-medium',
        className,
      )}
    >
      <div className="flex items-center gap-px">
        <span className="text-muted-foreground font-bold">{count}</span>
        <span>/</span>
        <span>{total}</span>
      </div>
      <span className="whitespace-nowrap">in stock</span>
    </div>
  )
}
