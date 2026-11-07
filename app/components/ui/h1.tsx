import { cn } from '@/app/lib/utils'

type Props = {
  children: React.ReactNode
  className?: string
}

export function H1({ children, className }: Props) {
  return (
    <h1
      className={cn(
        'scroll-m-20 overflow-hidden text-ellipsis whitespace-nowrap text-2xl font-bold tracking-tight sm:text-4xl',
        className,
      )}
    >
      {children}
    </h1>
  )
}
