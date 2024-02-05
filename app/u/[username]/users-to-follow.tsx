import { FC, PropsWithChildren } from 'react'

import { Stack } from '@/app/components/layout/stack'
import { H2 } from '@/app/components/ui/h2'
import { HorizontalScroller } from '@/app/components/ui/horizontal-scroller'
import { UserAvatarFollow } from '@/app/components/user/user-avatar-follow'
import { getAllFollowing } from '@/app/lib/model/follow'
import { getCurrentUser, getMostRecentActedUsers } from '@/app/lib/model/user'
import { CompProps } from '@/app/lib/types'
import { cn } from '@/app/lib/utils'

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

export function MobileHorizontalScroller({ children, className }: CompProps) {
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
  return (
    <Stack className="hidden lg:flex ps-6 pe-6 mt-[87px] w-[272px]">
      <div className="text-muted-foreground font-medium tracking-wide [font-stretch:condensed]">
        Users to Follow
      </div>
      <Stack gap={4}>{children}</Stack>
    </Stack>
  )
}
