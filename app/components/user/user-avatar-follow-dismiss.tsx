'use client'

import { Cross1Icon } from '@radix-ui/react-icons'

import { useMutate } from '@/app/api/use-mutate'
import { Level } from '@/app/components/layout/level'
import { IconButton } from '@/app/components/ui/button'
import { API_USERS } from '@/app/lib/routes'
import { User } from '@/app/lib/types'
import { cn } from '@/app/lib/utils'

type Props = {
  className?: string
  username?: string
  user: User
}

export function UserAvatarFollowDismiss({ className, username, user }: Props) {
  const { mutating, mutate } = useMutate(
    `${API_USERS}/${username}/exclude-followees/${user.id}`,
  )
  if (!username) return null
  return (
    <IconButton
      className={cn(
        'absolute -left-[12px] -top-[12px] z-20',
        'h-6 w-6 p-[3px]',
        'text-muted-foreground/75 hover:text-muted-foreground',
        mutating && 'animate-pulse text-accent-foreground',
        'shadow',
        className,
      )}
      size="xs"
      disabled={mutating}
      onClick={() => {
        if (mutating) return
        mutate({ method: 'PATCH' })
      }}
    >
      <Level
        className={cn(
          'h-full w-full p-[3px]',
          'rounded-full border border-border bg-muted/60',
          mutating && 'bg-secondary',
        )}
        justify="center"
      >
        <Cross1Icon strokeWidth="2px" />
        <span className="sr-only">Dismiss</span>
      </Level>
    </IconButton>
  )
}
