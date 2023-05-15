import { cn } from '@/lib/utils'

type Props = {
  children: React.ReactNode
  className?: string
}

export function Container({ children, className }: Props) {
  return (
    <div
      className={cn(
        className,
        'grid grid-cols-[1fr_var(--container-width)_1fr] [--container-padding:theme(spacing.4)] [--container-width:min(1200px,calc(100%-2*var(--container-padding)))] [&>*]:col-[2/auto]'
      )}
    >
      {children}
    </div>
  )
}
