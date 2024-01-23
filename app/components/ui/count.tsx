import { cn } from '@/app/lib/utils'

type Props = {
  className?: string
  count: number
  total?: number
}

export function Count({ className, count, total = count }: Props) {
  return (
    <div
      className={cn(
        'inline-flex items-baseline font-medium tracking-normal text-muted-foreground',
        className,
      )}
    >
      <span>{count}</span>
      {total > count && (
        <span className="text-muted-foreground/60">
          <span>/</span>
          <span>{total}</span>
        </span>
      )}
    </div>
  )
}
