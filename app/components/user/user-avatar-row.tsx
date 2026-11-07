import Link from 'next/link'
import { forwardRef } from 'react'

import { Level } from '@/app/components/layout/level'
import { UserAvatarImage } from '@/app/components/user/user-avatar-image'
import { toHome } from '@/app/lib/routes'
import { User } from '@/app/lib/types'

export type Props = {
  user: User
}

export const UserAvatarRow = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & Props
>(({ children, className, user, ...props }, ref) => {
  const { username, displayName } = user
  return (
    <Level ref={ref} items="center" className={className} {...props}>
      <Link
        className="flex flex-1 items-center gap-2 overflow-hidden sm:ms-0.5"
        href={toHome(username)}
      >
        <UserAvatarImage className="text-3xl" user={user} size="xl" />
        <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-lg font-bold tracking-tight sm:text-xl">
          {displayName ?? username}
        </div>
      </Link>
      {children}
    </Level>
  )
})
UserAvatarRow.displayName = 'UserAvatarWithName'
