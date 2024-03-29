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
        'z-20 absolute -top-[12px] -left-[12px]',
        'p-[3px] w-6 h-6',
        'text-muted-foreground/75 hover:text-muted-foreground',
        mutating && 'text-accent-foreground animate-pulse',
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
          'p-[3px] w-full h-full',
          'bg-muted/60 border border-border rounded-full',
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
