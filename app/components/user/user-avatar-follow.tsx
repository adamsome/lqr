import Link from 'next/link'

import { FollowButton } from '@/app/components/user/follow-button'
import { Level } from '@/app/components/layout/level'
import { Stack } from '@/app/components/layout/stack'
import { UserAvatarImage } from '@/app/components/user/user-avatar-image'
import { toHome } from '@/app/lib/routes'
import { User } from '@/app/lib/types'
import { cn } from '@/app/lib/utils'

type Props = {
  className?: string
  user: User
}

export function UserAvatarFollow({ className, user }: Props) {
  const { displayName, username } = user
  const name = user ? displayName ?? username ?? '?' : ''
  return (
    <Stack
      className={cn(
        'isolate relative p-2 bg-muted/50 text-muted-foreground rounded-md',
        className,
      )}
      gap={1}
    >
      <Level justify="between" gap={3}>
        <Link
          className="before:absolute before:inset-0 before:z-0"
          href={toHome(user.username)}
        >
          <UserAvatarImage className="text-2xl -ms-0.5" user={user} size="lg" />
        </Link>
        <FollowButton
          className="z-10 p-0 text-xs w-16 h-6 self-start text-muted-foreground"
          variant="secondary"
          size="xs"
          username={user.username}
        />
      </Level>
      <div className="text-sm font-bold tracking-tight overflow-hidden text-ellipsis whitespace-nowrap">
        {name}
      </div>
    </Stack>
  )
}
