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
          'h-auto p-0 text-muted-foreground hover:bg-transparent hover:text-secondary-foreground',
          accent &&
            'text-accent-strong hover:text-accent-foreground dark:text-secondary-foreground',
        )}
        variant="ghost"
        size="xs"
      >
        {children}
      </Button>
    </Link>
  )
}
