import { isBefore, parseISO, subDays } from 'date-fns/fp'
import { FC, PropsWithChildren } from 'react'

import { Stack } from '@/app/components/layout/stack'
import { HorizontalScroller } from '@/app/components/ui/horizontal-scroller'
import { UserAvatarFollow } from '@/app/components/user/user-avatar-follow'
import { UserAvatarFollowDismissAll } from '@/app/components/user/user-avatar-follow-dismiss-all'
import { getAllFollowing } from '@/app/lib/model/follow'
import { getCurrentUser, getMostRecentActedUsers } from '@/app/lib/model/user'
import { CompProps, type UserEntity } from '@/app/lib/types'
import { cn } from '@/app/lib/utils'

type Props = {
  username?: string
  Wrapper?: FC<PropsWithChildren>
}

const isOlderThan30Days = (now: Date, at: string) =>
  isBefore(subDays(30, now), parseISO(at))

const shouldExcludeAll = (now: Date, { excludedAllFolloweesAt }: UserEntity) =>
  excludedAllFolloweesAt && !isOlderThan30Days(now, excludedAllFolloweesAt)

export async function UsersToFollow({
  username,
  Wrapper = DefaultStack,
}: Props) {
  const { user, currentUser } = await getCurrentUser(username)

  if (!currentUser || shouldExcludeAll(new Date(), currentUser)) return null

  const follows = await getAllFollowing(currentUser.id)
  const followees = follows
    .filter(({ follows }) => follows)
    .map(({ followee }) => followee)

  const { excludeFollowees = [] } = currentUser
  const exclude = [currentUser.id, ...followees, ...excludeFollowees]
  if (user) exclude.push(user.id)

  const usersToFollow = await getMostRecentActedUsers({ exclude, limit: 7 })

  if (!usersToFollow.length) return null

  return (
    <Wrapper>
      {usersToFollow.map((u) => (
        <UserAvatarFollow key={u.id} user={u} />
      ))}
      {usersToFollow.length > 2 && (
        <UserAvatarFollowDismissAll username={username} />
      )}
    </Wrapper>
  )
}

export function MobileHorizontalScroller({ children, className }: CompProps) {
  return (
    <div className={cn('!col-span-full lg:hidden', className)}>
      <HorizontalScroller
        className="-my-2.5 px-4 py-2.5 sm:px-6 lg:hidden [&:empty]:hidden"
        countInView={[2, 3, 4]}
      >
        {children}
      </HorizontalScroller>
    </div>
  )
}

function DefaultStack({ children }: PropsWithChildren) {
  return (
    <Stack className="mt-[87px] hidden w-[272px] pe-6 ps-6 lg:flex">
      <div className="font-medium tracking-wide text-muted-foreground [font-stretch:condensed]">
        Users to Follow
      </div>
      <Stack gap={4}>{children}</Stack>
    </Stack>
  )
}
