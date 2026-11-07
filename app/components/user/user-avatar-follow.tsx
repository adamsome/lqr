import { Level } from '@/app/components/layout/level'
import { Stack } from '@/app/components/layout/stack'
import { LINK_BOX_CLASSNAME, LinkBoxLink } from '@/app/components/ui/link-box'
import { FollowButton } from '@/app/components/user/follow-button'
import { UserAvatarFollowDismiss } from '@/app/components/user/user-avatar-follow-dismiss'
import { UserAvatarImage } from '@/app/components/user/user-avatar-image'
import { getCurrentUser } from '@/app/lib/model/user'
import { toHome } from '@/app/lib/routes'
import { User } from '@/app/lib/types'
import { cn } from '@/app/lib/utils'

type Props = {
  className?: string
  user: User
}

export async function UserAvatarFollow({ className, user }: Props) {
  const { currentUser } = await getCurrentUser()
  const { displayName, username } = user
  const name = user ? (displayName ?? username ?? '?') : ''
  return (
    <Stack
      className={cn(
        'relative rounded-md border border-border bg-popover p-2 text-muted-foreground',
        LINK_BOX_CLASSNAME,
        className,
      )}
      gap={1}
    >
      <Level justify="between" gap={3}>
        <LinkBoxLink href={toHome(user.username)}>
          <UserAvatarImage className="-ms-0.5 text-2xl" user={user} size="lg" />
        </LinkBoxLink>
        <FollowButton
          className="z-10 h-6 w-16 self-start p-0 text-xs"
          variant="secondary"
          size="xs"
          username={user.username}
        />
      </Level>
      <div className="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-bold tracking-tight">
        {name}
      </div>
      <UserAvatarFollowDismiss username={currentUser?.username} user={user} />
    </Stack>
  )
}
