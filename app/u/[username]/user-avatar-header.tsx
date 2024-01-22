import Link from 'next/link'

import { FollowButtonContainer } from '@/app/u/[username]/follow-button-container'
import { Level } from '@/components/layout/level'
import { Stack } from '@/components/layout/stack'
import { UserAvatarImage } from '@/components/user-avatar-image'
import { getCounts } from '@/lib/model/counts'
import { getCurrentUser } from '@/lib/model/user'
import { toBar, toFollowing, toSpecs } from '@/lib/routes'
import { Counts, User } from '@/lib/types'

type Props = {
  className?: string
  username?: string
  counts?: Partial<Counts>
}

export async function UserAvatarHeader({
  className,
  username,
  counts: partialCounts,
}: Props) {
  const { user, isCurrentUser } = await getCurrentUser(username)
  const counts = await getCounts(user?.id, partialCounts)
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

function Counts({ username, counts }: Pick<Props, 'username' | 'counts'>) {
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
