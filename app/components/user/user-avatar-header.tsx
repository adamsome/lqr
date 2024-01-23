import Link from 'next/link'

import { Level } from '@/app/components/layout/level'
import { Stack } from '@/app/components/layout/stack'
import { FollowButtonContainer } from '@/app/components/user/follow-button-container'
import { UserAvatarImage } from '@/app/components/user/user-avatar-image'
import { getCounts } from '@/app/lib/model/counts'
import { getCurrentUser } from '@/app/lib/model/user'
import { toBar, toFollowing, toSpecs } from '@/app/lib/routes'
import { Counts, User } from '@/app/lib/types'

type Props = {
  className?: string
  username?: string
}

export async function UserAvatarHeader({ className, username }: Props) {
  const { user, isCurrentUser } = await getCurrentUser(username)
  const counts = await getCounts(user?.id)
  return (
    <Stack className={className} gap={1}>
      <Level className="sm:justify-normal" justify="between" gap={3}>
        <UserAvatarImage
          className="text-4xl sm:text-5xl -ms-1"
          user={user}
          size="2xl"
        />
        <div className="hidden sm:flex flex-col flex-1 leading-none overflow-hidden">
          <Name user={user} />
          <Counts username={username} counts={counts} />
        </div>
        {!isCurrentUser && <FollowButtonContainer username={username} />}
      </Level>
      <Stack className="sm:hidden flex-1 leading-none overflow-hidden" gap={0}>
        <Name user={user} />
        <Counts username={username} counts={counts} />
      </Stack>
    </Stack>
  )
}

function Name({ user }: { user: User | null }) {
  const { displayName, username } = user ?? {}
  const name = user ? displayName ?? username ?? '?' : ''
  return (
    <div className="text-2xl sm:text-4xl font-bold tracking-tight overflow-hidden text-ellipsis whitespace-nowrap">
      {name}
    </div>
  )
}

type CountsProps = {
  username?: string
  counts?: Partial<Counts>
}

function Counts({ username, counts }: CountsProps) {
  const { bottles = 0, specs = 0, following = 0 } = counts ?? {}
  return (
    <Level
      className="text-sm text-muted-foreground font-medium overflow-hidden"
      gap={4}
    >
      <Link className="whitespace-nowrap" href={toSpecs(username)}>
        <span className="text-foreground font-bold">{specs}</span>{' '}
        {`spec${specs !== 1 ? 's' : ''}`}
      </Link>
      <Link className="whitespace-nowrap" href={toBar(username)}>
        <span className="text-foreground font-bold">{bottles}</span>{' '}
        {`bottle${bottles !== 1 ? 's' : ''}`}
      </Link>
      <Link
        className="whitespace-nowrap overflow-hidden text-ellipsis"
        href={toFollowing(username)}
      >
        <span className="text-foreground font-bold">{following}</span> following
      </Link>
    </Level>
  )
}
