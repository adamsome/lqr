import { cn } from '@/app/lib/utils'
import { range } from 'ramda'
import { CSSProperties } from 'react'

type Props = {
  className?: string
  loading: boolean
  size?: string
}

export function Loader({ className, loading, size = '20px' }: Props) {
  if (!loading) return null
  return (
    <div
      className={cn(
        'relative flex items-center justify-center',
        'w-[var(--size)] h-[var(--size)]',
        'data-[state=on]:animate-fade-in',
        className,
      )}
      style={{ '--size': size } as CSSProperties}
      data-state={loading ? 'on' : 'off'}
    >
      {range(0, 5).map((i) => (
        <Line key={i} index={i} />
      ))}
    </div>
  )
}

type LineProps = {
  index: number
}

function Line({ index }: LineProps) {
  return (
    <div
      className={cn(
        'absolute top-0 left-[calc(var(--size))]',
        'w-[calc(var(--size)/20)] h-[var(--size)]',
        'bg-accent-foreground animate-loader',
      )}
      style={{
        left: `calc(${index} * (var(--size) / 5 + var(--size) / 25) - var(--size) / 12)`,
        animationDelay: `${index * 0.15}s`,
      }}
    />
  )
}
