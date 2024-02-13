import { CardTitle } from '@/app/components/ui/card'
import type { Spec } from '@/app/lib/types'
import { cn } from '@/app/lib/utils'

type Props = {
  className?: string
  spec: Spec
}

export function Title({ className, spec }: Props) {
  const { name, year } = spec
  return (
    <CardTitle
      className={cn(
        'font-bold leading-tight tracking-tight whitespace-nowrap text-ellipsis overflow-hidden',
        className,
      )}
    >
      {name}
      {year && (
        <span className="text-muted-foreground font-medium"> ({year})</span>
      )}
    </CardTitle>
  )
}
