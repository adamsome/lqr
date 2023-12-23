import { auth } from '@clerk/nextjs'
import { zipWith } from 'ramda'
import invariant from 'tiny-invariant'

import { FollowButton } from '@/app/u/[username]/follow-button'
import {
  FollowingLayout,
  FollowingItem,
  FollowingItemProps,
  FollowingList,
  FollowingEmpty,
} from '@/app/u/[username]/following/following-layout'
import { UserAvatarHeader } from '@/app/u/[username]/user-avatar-header'
import { getFollowsByFollower } from '@/lib/model/follow'
import { getIngredientData } from '@/lib/model/ingredient-data'
import { getSpecs } from '@/lib/model/spec'
import { getManyUsers, getUser, getUserByID } from '@/lib/model/user'
import { getStockedBottleCount } from '@/lib/stock'
import { toDict } from '@/lib/utils'

type Props = {
  params?: {
    username?: string
  }
}

export default async function Page({ params = {} }: Props) {
  const { username } = params

  const user = await getUser(username)

  // TODO: Show "User not found"
  invariant(user, `User not found.`)

  const { userId: currentUserID } = auth()

  const [currentUser, userFollows, currentFollows, data] = await Promise.all([
    getUserByID(currentUserID),
    getFollowsByFollower(user.id),
    currentUserID && currentUserID !== user.id
      ? getFollowsByFollower(currentUserID)
      : Promise.resolve(null),
    getIngredientData(user.id),
  ])

  const followByFollowee = toDict(
    currentFollows ?? userFollows,
    ({ followee }) => followee,
  )

  const followeeIDs = userFollows.map(({ followee }) => followee)

  const [followeeUsers, specs] = await Promise.all([
    getManyUsers(followeeIDs),
    getSpecs(user.id),
  ])

  const followees = zipWith(
    (user, follow): FollowingItemProps => ({ user, follow }),
    followeeUsers,
    userFollows,
  )

  const bottleCount = getStockedBottleCount(data.dict)
  const specCount = specs.filter(({ userID }) => userID === user.id).length
  const followingCount = userFollows.filter(({ follows }) => follows).length

  return (
    <FollowingLayout
      user={user}
      currentUser={currentUser}
      header={
        <UserAvatarHeader
          user={user}
          specCount={specCount}
          bottleCount={bottleCount}
          followingCount={followingCount}
        >
          {currentUserID && currentUserID !== user.id && (
            <FollowButton
              username={user.username}
              follow={followByFollowee[user.id]}
            />
          )}
        </UserAvatarHeader>
      }
    >
      <FollowingList>
        {followees.map((userFollow) => {
          const { user } = userFollow
          const { id, username } = user
          const follow = followByFollowee[id]
          return (
            <FollowingItem key={id} {...userFollow}>
              {currentUserID && (
                <FollowButton username={username} follow={follow} />
              )}
            </FollowingItem>
          )
        })}
        {followees.length === 0 && <FollowingEmpty />}
      </FollowingList>
    </FollowingLayout>
  )
}
