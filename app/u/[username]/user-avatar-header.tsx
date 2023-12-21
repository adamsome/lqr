import Link from 'next/link'
import { ReactNode } from 'react'

import { UserAvatar } from '@/components/user-avatar'
import { UserAvatarImage } from '@/components/user-avatar-image'
import { toBar, toSpecs } from '@/lib/routes'
import { User } from '@/lib/types'
import { cn } from '@/lib/utils'

type Props = {
  children?: ReactNode
  className?: string
  user: User
  specCount: number
  bottleCount: number
}

export function UserAvatarHeader({ children, className, ...props }: Props) {
  const { user } = props
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <div className="flex items-center justify-between sm:justify-normal gap-3">
        <UserAvatarImage
          className="text-4xl sm:text-5xl -ms-1"
          user={user}
          size="2xl"
        />
        <div className="hidden sm:flex flex-col flex-1 leading-none overflow-hidden">
          <Name {...props} />
          <Counts {...props} />
        </div>
        {children}
      </div>
      <div className="sm:hidden flex flex-col flex-1 leading-none overflow-hidden">
        <Name {...props} />
        <Counts {...props} />
      </div>
    </div>
  )
}

function Name({ user }: Omit<Props, 'children'>) {
  const { displayName, username } = user
  const name = user ? displayName ?? username ?? '?' : ''
  return (
    <div className="text-2xl sm:text-4xl font-bold tracking-tight overflow-hidden text-ellipsis whitespace-nowrap">
      {name}
    </div>
  )
}

function Counts({ user, specCount, bottleCount }: Omit<Props, 'children'>) {
  return (
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
  )
}
