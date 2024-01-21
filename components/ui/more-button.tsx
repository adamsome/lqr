import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { FormEventHandler } from 'react'

import { IconButton } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Props = {
  className?: string
  onClick?: FormEventHandler<HTMLButtonElement>
}

export function MoreButton({ className, onClick }: Props) {
  return (
    <IconButton
      className={cn(
        'h-6 w-6 rounded-full text-muted-foreground bg-foreground/5 hover:bg-foreground/10',
        className,
      )}
      variant="secondary"
      onClick={onClick}
    >
      <DotsHorizontalIcon />
    </IconButton>
  )
}
