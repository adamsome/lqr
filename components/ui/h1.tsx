import { cn } from '@/lib/utils'

type Props = {
  children: React.ReactNode
  className?: string
}

export function H1({ children, className }: Props) {
  return (
    <h1
      className={cn(
        'scroll-m-20 text-2xl font-semibold tracking-tight',
        className
      )}
    >
      {children}
    </h1>
  )
}
