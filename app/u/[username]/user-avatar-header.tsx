import Link from 'next/link'
import { ReactNode } from 'react'

import { UserAvatarImage } from '@/components/user-avatar-image'
import { getCounts } from '@/lib/model/counts'
import { getUser } from '@/lib/model/user'
import { toBar, toFollowing, toSpecs } from '@/lib/routes'
import { Counts, User } from '@/lib/types'
import { cn } from '@/lib/utils'

type Props = {
  children?: ReactNode
  className?: string
  username?: string
  counts?: Partial<Counts>
}

export async function UserAvatarHeader({
  children,
  className,
  username,
  counts: partialCounts,
}: Props) {
  const user = await getUser(username)
  const counts = await getCounts(user?.id, partialCounts)
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <div className="flex items-center justify-between sm:justify-normal gap-3">
        <UserAvatarImage
          className="text-4xl sm:text-5xl -ms-1"
          user={user}
          size="2xl"
        />
        <div className="hidden sm:flex flex-col flex-1 leading-none overflow-hidden">
          <Name user={user} />
          <Counts username={username} counts={counts} />
        </div>
        {children}
      </div>
      <div className="sm:hidden flex flex-col flex-1 leading-none overflow-hidden">
        <Name user={user} />
        <Counts username={username} counts={counts} />
      </div>
    </div>
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
    <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium overflow-hidden">
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
    </div>
  )
}
