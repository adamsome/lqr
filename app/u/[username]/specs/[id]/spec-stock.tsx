import { Level } from '@/app/components/layout/level'
import { CircleProgress } from '@/app/components/ui/circle-progress'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/app/components/ui/tooltip'
import { SpecStock } from '@/app/lib/types'
import { cn } from '@/app/lib/utils'

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
            className={cn('text-muted-foreground w-4', className)}
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
  const completed = count > 0 && count === total
  return (
    <Level
      className={cn(
        'font-medium',
        completed ? 'text-accent-muted' : 'text-muted-foreground/60',
        className,
      )}
      gap={1}
    >
      <Level className="gap-px">
        <span
          className={cn(
            'text-muted-foreground font-bold',
            completed && 'text-accent-foreground',
          )}
        >
          {count}
        </span>
        <span>/</span>
        <span>{total}</span>
      </Level>
      <span className="whitespace-nowrap">in stock</span>
    </Level>
  )
}
