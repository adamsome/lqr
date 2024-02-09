'use client'

import { Cross1Icon } from '@radix-ui/react-icons'

import { useMutate } from '@/app/api/use-mutate'
import { Level } from '@/app/components/layout/level'
import { Button, IconButton } from '@/app/components/ui/button'
import { API_USERS } from '@/app/lib/routes'
import { User } from '@/app/lib/types'
import { cn } from '@/app/lib/utils'
import { Stack } from '@/app/components/layout/stack'

type Props = {
  className?: string
  username?: string
}

export function UserAvatarFollowDismissAll({ className, username }: Props) {
  const { mutating, mutate } = useMutate(
    `${API_USERS}/${username}/exclude-followees`,
  )
  if (!username) return null
  return (
    <Button
      className={cn(
        'max-w-[50%] h-full text-muted-foreground/50 text-xs border border-border border-dashed rounded-md',
        mutating && 'animate-pulse',
        className,
      )}
      variant="outline"
      disabled={mutating}
      onClick={() => {
        if (mutating) return
        mutate({ method: 'PUT' })
      }}
    >
      Clear All
    </Button>
  )
}
