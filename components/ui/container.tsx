import { cn } from '@/lib/utils'

type Props = {
  children: React.ReactNode
  className?: string
  skip?: boolean
  noPad?: boolean
}

export function Container({ children, className, skip, noPad }: Props) {
  return (
    <div
      className={cn(
        !skip &&
          'grid grid-cols-[1fr_var(--container-width)_1fr] gap-y-6 sm:gap-y-8 [--container-w-max:1200px] [--container-width:min(var(--container-w-max),calc(100%-2*var(--container-padding,0px)))] [&>*]:col-[2/auto]',
        !noPad &&
          '[--container-padding:theme(spacing.4)] sm:[--container-padding:theme(spacing.6)]',
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
