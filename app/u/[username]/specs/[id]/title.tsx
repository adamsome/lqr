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
        'overflow-hidden text-ellipsis whitespace-nowrap font-bold leading-tight tracking-tight',
        className,
      )}
    >
      {name}
      {year && (
        <span className="font-medium text-muted-foreground"> ({year})</span>
      )}
    </CardTitle>
  )
}
