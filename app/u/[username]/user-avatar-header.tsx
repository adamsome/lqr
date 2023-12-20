import Link from 'next/link'

import { UserAvatar } from '@/components/user-avatar'
import { toBar, toSpecs } from '@/lib/routes'
import { User } from '@/lib/types'

type Props = {
  user: User
  specCount: number
  bottleCount: number
}

export function UserAvatarHeader({ user, specCount, bottleCount }: Props) {
  return (
    <UserAvatar user={user} size="xl">
      <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium overflow-hidden">
        <Link className="whitespace-nowrap" href={toSpecs(user.username)}>
          <span className="text-foreground font-bold">{specCount}</span>{' '}
          {`spec${specCount !== 1 ? 's' : ''}`}
        </Link>
        <Link
          className="whitespace-nowrap overflow-hidden text-ellipsis"
          href={toBar(user.username)}
        >
          <span className="text-foreground font-bold">{bottleCount}</span>{' '}
          {`bottle${bottleCount !== 1 ? 's' : ''}`}
        </Link>
      </div>
    </UserAvatar>
  )
}
