import invariant from 'tiny-invariant'

import { FollowButtonContainer } from '@/app/components/user/follow-button-container'
import { EmptyList } from '@/app/u/[username]/following/empty-list'
import { EnsureFollows } from '@/app/u/[username]/following/ensure-follows'
import { UserAvatarRow } from '@/app/components/user/user-avatar-row'
import { Stack } from '@/app/components/layout/stack'
import { getAllFollowing } from '@/app/lib/model/follow'
import { getCurrentUser, getManyUsers } from '@/app/lib/model/user'
import { cn, toDict } from '@/app/lib/utils'

type Props = {
  className?: string
  username?: string
}

export async function List({ className, username }: Props) {
  const { user, currentUser } = await getCurrentUser(username)

  invariant(user, `User not found.`)

  const userFollowing = await getAllFollowing(user.id)
  const userFollowingIDs = userFollowing.map(({ followee }) => followee)
  const followingUsers = await getManyUsers(userFollowingIDs)

  const currentUserFollowing = await getAllFollowing(currentUser?.id)
  const byFollowee = toDict(currentUserFollowing, ({ followee }) => followee)

  return (
    <Stack className={cn('w-full', className)} gap={4}>
      {followingUsers.map((u) => (
        <EnsureFollows key={u.id} follow={byFollowee[u.id]}>
          <UserAvatarRow user={u}>
            <FollowButtonContainer username={u.username} />
          </UserAvatarRow>
        </EnsureFollows>
      ))}
      {followingUsers.length === 0 && <EmptyList />}
    </Stack>
  )
}
