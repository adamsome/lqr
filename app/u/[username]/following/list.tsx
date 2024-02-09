import { add, isPast, parseISO } from 'date-fns'
import invariant from 'tiny-invariant'

import { Empty } from '@/app/components/empty'
import { Stack } from '@/app/components/layout/stack'
import { FollowButtonContainer } from '@/app/components/user/follow-button-container'
import { UserAvatarRow } from '@/app/components/user/user-avatar-row'
import { getAllFollowing } from '@/app/lib/model/follow'
import {
  getAllUsers,
  getCurrentUser,
  getMostRecentActedUsers,
} from '@/app/lib/model/user'
import type { User } from '@/app/lib/types'
import { cn, toDict } from '@/app/lib/utils'
import { EnsureFollows } from '@/app/u/[username]/following/ensure-follows'

type Props = {
  className?: string
  username?: string
}

export async function List({ className, username }: Props) {
  const { user, currentUser, isCurrentUser } = await getCurrentUser(username)

  invariant(user, `User not found.`)

  const userFollowing = await getAllFollowing(user.id)
  const userFollowingIDs = userFollowing.map(({ followee }) => followee)
  const followingUsers = await getAllUsers(userFollowingIDs)

  const currentUserFollowing = await getAllFollowing(currentUser?.id)
  const byFollowee = toDict(currentUserFollowing, ({ followee }) => followee)

  let usersToFollow: User[] = []
  if (currentUser && isCurrentUser) {
    const excluded = userFollowing
      .filter(
        ({ follows, followedAt }) =>
          follows || !isPast(add(parseISO(followedAt), { hours: 1 })),
      )
      .map(({ followee }) => followee)
    usersToFollow = await getMostRecentActedUsers({
      exclude: [currentUser.id, ...excluded],
      limit: 15,
    })
  }

  return (
    <Stack className={cn(className)} gap={7}>
      {followingUsers.length > 0 && (
        <Stack className={'w-full'} gap={4}>
          {followingUsers.map((u) => (
            <EnsureFollows key={u.id} follow={byFollowee[u.id]}>
              <UserAvatarRow user={u}>
                <FollowButtonContainer username={u.username} />
              </UserAvatarRow>
            </EnsureFollows>
          ))}
        </Stack>
      )}
      {usersToFollow.length > 0 && (
        <Stack gap={3}>
          <div className="text-xl text-muted-foreground font-medium tracking-wide [font-stretch:condensed]">
            Users to Follow
          </div>
          <Stack gap={4}>
            {usersToFollow.map((u) => (
              <UserAvatarRow key={u.id} user={u}>
                <FollowButtonContainer username={u.username} />
              </UserAvatarRow>
            ))}
          </Stack>
        </Stack>
      )}
      {followingUsers.length === 0 && usersToFollow.length === 0 && (
        <Empty title="Not following any other bar managers">
          Follow some more managers to have
          <br />
          more specs to explore!
        </Empty>
      )}
    </Stack>
  )
}
