import { add, isPast, parseISO } from 'date-fns'
import Link from 'next/link'
import { ReactNode, forwardRef } from 'react'

import { Container } from '@/components/layout/container'
import * as Layout from '@/components/layout/responsive-layout'
import { UserAvatar } from '@/components/user-avatar'
import { UserAvatarImage } from '@/components/user-avatar-image'
import { getCurrentUser } from '@/lib/model/user'
import { toHome } from '@/lib/routes'
import { Follow, User } from '@/lib/types'
import { cn } from '@/lib/utils'

type Props = {
  children?: ReactNode
  header: ReactNode
  username?: string
}

export async function FollowingLayout({ children, header, username }: Props) {
  const { user, currentUser, isCurrentUser } = await getCurrentUser(username)
  return (
    <Layout.Root>
      <Layout.Header title={<UserAvatar user={user} />}>
        {currentUser && !isCurrentUser && (
          <Layout.Back href={toHome(currentUser.username)} user={currentUser} />
        )}
      </Layout.Header>

      <Container className="my-4 sm:my-6 [--container-w-max:800px]">
        <div className="flex flex-col gap-5 sm:gap-6">
          {header}
          {children}
        </div>
      </Container>
    </Layout.Root>
  )
}

export const FollowingList = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-1 flex-col gap-4 w-full', className)}
    {...props}
  />
))
FollowingList.displayName = 'FollowingList'

export type FollowingItemProps = {
  user: User
  follow?: Follow | null
}

export const FollowingItem = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & FollowingItemProps
>(({ children, className, user, follow: follow, ...props }, ref) => {
  if (!follow) return null
  const { followedAt, follows } = follow
  if (!follows && isPast(add(parseISO(followedAt), { hours: 1 }))) return null
  return (
    <div
      ref={ref}
      className={cn('flex items-center gap-2', className)}
      {...props}
    >
      <Link
        className="flex-1 flex items-center gap-2 -ms-1 overflow-hidden"
        href={toHome(user.username)}
      >
        <UserAvatarImage className="text-3xl" user={user} size="xl" />
        <div className="flex-1 text-lg sm:text-xl font-bold tracking-tight overflow-hidden whitespace-nowrap text-ellipsis">
          {user.displayName}
        </div>
      </Link>
      {children}
    </div>
  )
})
FollowingItem.displayName = 'FollowingItem'

export const FollowingEmpty = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-lg text-muted-foreground/50 font-semibold', className)}
    {...props}
  >
    Not following any users
  </div>
))
FollowingEmpty.displayName = 'FollowingEmpty'
