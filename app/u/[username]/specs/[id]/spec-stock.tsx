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
        <div className="flex items-center gap-1 text-muted-foreground">
          <div className="flex items-center gap-1 text-muted-foreground">
            <span>{count}</span>
            <span className="text-muted-foreground/60">/</span>
            <span>{total}</span>
          </div>
          <span>In Stock</span>
        </div>
      </TooltipContent>
    </Tooltip>
  )
}
