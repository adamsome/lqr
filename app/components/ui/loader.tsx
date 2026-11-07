import { cn } from '@/app/lib/utils'
import { range } from 'ramda'
import { CSSProperties } from 'react'

type Props = {
  className?: string
  loading: boolean
  size?: string
  invert?: boolean
}

export function Loader({ className, loading, size = '20px', invert }: Props) {
  if (!loading) return null
  return (
    <div
      className={cn(
        'relative flex items-center justify-center',
        'h-[var(--size)] w-[var(--size)]',
        'data-[state=on]:animate-fade-in',
        invert ? '[&>div]:bg-background' : '[&>div]:bg-accent-foreground',
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
        'absolute left-[calc(var(--size))] top-0',
        'h-[var(--size)] w-[calc(var(--size)/20)]',
        'bg- animate-loader',
      )}
      style={{
        left: `calc(${index} * (var(--size) / 5 + var(--size) / 25) - var(--size) / 12)`,
        animationDelay: `${index * 0.15}s`,
      }}
    />
  )
}
