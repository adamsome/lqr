import { zipWith } from 'ramda'
import invariant from 'tiny-invariant'

import { FollowButton } from '@/app/u/[username]/follow-button'
import {
  FollowingEmpty,
  FollowingItem,
  FollowingItemProps,
  FollowingLayout,
  FollowingList,
} from '@/app/u/[username]/following/following-layout'
import { UserAvatarHeader } from '@/app/u/[username]/user-avatar-header'
import { getFollowsByFollower } from '@/lib/model/follow'
import { getCurrentUser, getManyUsers } from '@/lib/model/user'
import { toDict } from '@/lib/utils'

type Props = {
  params?: {
    username?: string
  }
}

export default async function Page({ params = {} }: Props) {
  const { username } = params

  const { user, currentUser, isCurrentUser } = await getCurrentUser(username)

  invariant(user, `User not found.`)

  const [userFollows, currentFollows] = await Promise.all([
    getFollowsByFollower(user.id),
    currentUser && !isCurrentUser
      ? getFollowsByFollower(currentUser.id)
      : Promise.resolve(null),
  ])

  const followByFollowee = toDict(
    currentFollows ?? userFollows,
    ({ followee }) => followee,
  )

  const followeeIDs = userFollows.map(({ followee }) => followee)

  const [followeeUsers] = await Promise.all([getManyUsers(followeeIDs)])

  const followees = zipWith(
    (user, follow): FollowingItemProps => ({ user, follow }),
    followeeUsers,
    userFollows,
  )

  return (
    <FollowingLayout
      username={username}
      header={
        <UserAvatarHeader username={username}>
          {currentUser && !isCurrentUser && (
            <FollowButton
              username={user.username}
              follow={followByFollowee[user.id]}
            />
          )}
        </UserAvatarHeader>
      }
    >
      <FollowingList>
        {followees.map((userFollow) => (
          <FollowingItem key={userFollow.user.id} {...userFollow}>
            {currentUser && (
              <FollowButton
                username={userFollow.user.username}
                follow={followByFollowee[userFollow.user.id]}
              />
            )}
          </FollowingItem>
        ))}
        {followees.length === 0 && <FollowingEmpty />}
      </FollowingList>
    </FollowingLayout>
  )
}
