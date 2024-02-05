import { Level } from '@/app/components/layout/level'
import { Stack } from '@/app/components/layout/stack'
import { LINK_BOX_CLASSNAME, LinkBoxLink } from '@/app/components/ui/link-box'
import { FollowButton } from '@/app/components/user/follow-button'
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
        'p-2 bg-popover text-muted-foreground border border-border rounded-md',
        LINK_BOX_CLASSNAME,
        className,
      )}
      gap={1}
    >
      <Level justify="between" gap={3}>
        <LinkBoxLink href={toHome(user.username)}>
          <UserAvatarImage className="text-2xl -ms-0.5" user={user} size="lg" />
        </LinkBoxLink>
        <FollowButton
          className="z-10 p-0 text-xs w-16 h-6 self-start"
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
