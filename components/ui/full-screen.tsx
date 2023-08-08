import { Container } from '@/components/ui/container'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'
import { useMedia } from 'react-use'

type Props = {
  children: ReactNode
  className?: string
  onlySm?: boolean
}

export function FullScreen({ children, className, onlySm }: Props) {
  const isMd = useMedia('(min-width: 768px)', true)
  const skip = isMd && onlySm
  return (
    <div
      className={cn(
        className,
        !skip &&
          'fixed inset-0 z-50 h-screen w-screen bg-background overflow-hidden',
      )}
    >
      <Container skip={skip}>{children}</Container>
    </div>
  )
}
