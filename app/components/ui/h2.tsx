import { cn } from '@/app/lib/utils'

type Props = {
  children: React.ReactNode
  className?: string
}

export function H2({ children, className }: Props) {
  return (
    <h2
      className={cn(
        'scroll-m-16 overflow-hidden text-ellipsis whitespace-nowrap text-lg font-semibold tracking-tight sm:text-xl',
        className,
      )}
    >
      {children}
    </h2>
  )
}
