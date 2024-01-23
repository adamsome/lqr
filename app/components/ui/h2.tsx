import { cn } from '@/app/lib/utils'

type Props = {
  children: React.ReactNode
  className?: string
}

export function H2({ children, className }: Props) {
  return (
    <h2
      className={cn(
        'scroll-m-16 text-lg sm:text-xl font-semibold tracking-tight overflow-hidden whitespace-nowrap text-ellipsis',
        className,
      )}
    >
      {children}
    </h2>
  )
}
