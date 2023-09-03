import { cn } from '@/lib/utils'

type Props = {
  children: React.ReactNode
  className?: string
  skip?: boolean
}

export function Container({ children, className, skip }: Props) {
  return (
    <div
      className={cn(
        !skip &&
          'grid grid-cols-[1fr_var(--container-width)_1fr] [--container-padding:theme(spacing.4)] [--container-w-max:1200px] [--container-width:min(var(--container-w-max),calc(100%-2*var(--container-padding)))] sm:[--container-padding:theme(spacing.6)] [&>*]:col-[2/auto]',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function FullWidthContainer({ children, className }: Props) {
  return <div className={cn('px-4 sm:px-6', className)}>{children}</div>
}
