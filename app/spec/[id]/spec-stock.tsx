import { Badge } from '@/components/ui/badge'
import { SpecStock } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Circle } from 'lucide-react'

type Props = {
  className?: string
  stock?: SpecStock
}

export function SpecStock({ className, stock }: Props) {
  const { count = 0, total = 0 } = stock ?? {}
  return (
    <Badge
      className={cn(
        'flex items-center gap-1 pe-2 ps-1.5 text-muted-foreground',
        className
      )}
      variant="secondary"
    >
      <Circle className="fill-foreground/40 text-foreground/40" size={12} />
      <span>{count}</span>
      <span className="text-muted-foreground/60">/</span>
      <span>{total}</span>
    </Badge>
  )
}
