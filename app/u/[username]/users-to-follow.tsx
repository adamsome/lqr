import { FC, PropsWithChildren } from 'react'

import { UserAvatarFollow } from '@/app/u/[username]/user-avatar-follow'
import { Stack } from '@/components/layout/stack'
import { HorizontalScroller } from '@/components/ui/horizontal-scroller'
import { getAllFollowing } from '@/lib/model/follow'
import { getCurrentUser, getMostRecentActedUsers } from '@/lib/model/user'
import { CompProps } from '@/lib/types'
import { cn } from '@/lib/utils'

type Props = {
  username?: string
  Wrapper?: FC<PropsWithChildren>
}

export async function UsersToFollow({
  username,
  Wrapper = DefaultStack,
}: Props) {
  const { user, currentUser } = await getCurrentUser(username)

  if (!currentUser) return null

  const follows = await getAllFollowing(currentUser.id)
  const followees = follows
    .filter(({ follows }) => follows)
    .map(({ followee }) => followee)

  const exclude = [currentUser.id, ...followees]
  if (user) exclude.push(user.id)

  const usersToFollow = await getMostRecentActedUsers({ exclude })

  if (!usersToFollow.length) return null

  return (
    <Wrapper>
      {usersToFollow.map((u) => (
        <UserAvatarFollow key={u.id} user={u} />
      ))}
    </Wrapper>
  )
}

export function MdHorizontalScroller({ children, className }: CompProps) {
  return (
    <div className={cn('!col-span-full lg:hidden', className)}>
      <HorizontalScroller
        className="px-4 sm:px-6 lg:hidden [&:empty]:hidden"
        countInView={[2, 3, 4]}
      >
        {children}
      </HorizontalScroller>
    </div>
  )
}

function DefaultStack({ children }: PropsWithChildren) {
  return <Stack gap={4}>{children}</Stack>
}
