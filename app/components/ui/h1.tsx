import { cn } from '@/app/lib/utils'

type Props = {
  children: React.ReactNode
  className?: string
}

export function H1({ children, className }: Props) {
  return (
    <h1
      className={cn(
        'scroll-m-20 text-2xl font-bold tracking-tight overflow-hidden whitespace-nowrap text-ellipsis sm:text-4xl',
        className,
      )}
    >
      {children}
    </h1>
  )
}
