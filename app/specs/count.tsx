type Props = {
  count: number
  total: number
}

export function Count({ count, total }: Props) {
  return (
    <div className="flex items-baseline text-lg font-medium tracking-normal text-muted-foreground">
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
