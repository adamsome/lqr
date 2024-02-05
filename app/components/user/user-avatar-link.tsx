import { Button } from '@/app/components/ui/button'
import { CompProps } from '@/app/lib/types'
import { cn } from '@/app/lib/utils'
import Link from 'next/link'

type Props = CompProps & {
  href: string
  accent?: boolean
}

export function UserAvatarLink({ children, className, href, accent }: Props) {
  return (
    <Link className={cn('flex items-baseline', className)} href={href}>
      <Button
        className={cn(
          'p-0 h-auto text-muted-foreground hover:text-secondary-foreground hover:bg-transparent',
          accent &&
            'text-accent-strong dark:text-secondary-foreground hover:text-accent-foreground',
        )}
        variant="ghost"
        size="xs"
      >
        {children}
      </Button>
    </Link>
  )
}
