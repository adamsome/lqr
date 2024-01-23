import { CompProps } from '@/app/lib/types'
import { cn } from '@/app/lib/utils'

type Props = CompProps & {
  pad?: 'responsive' | 'unresponsive' | 'none'
}

export function Container({ children, className, pad = 'responsive' }: Props) {
  return (
    <div
      className={cn(
        'grid grid-cols-[1fr_var(--container-width)_1fr] gap-y-6 sm:gap-y-8 [--container-w-max:1200px] [--container-width:min(var(--container-w-max),calc(100%-2*var(--container-padding,0px)))] [&>*]:col-[2/auto]',
        pad === 'unresponsive' && '[--container-padding:theme(spacing.4)]',
        pad === 'responsive' &&
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
