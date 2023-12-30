import { auth } from '@clerk/nextjs'

import { FollowButton } from '@/app/u/[username]/follow-button'
import { applyCriteria } from '@/app/u/[username]/specs/_criteria/apply'
import { Criteria } from '@/app/u/[username]/specs/_criteria/types'
import { FiltersContainer } from '@/app/u/[username]/specs/filters-container'
import { Grid } from '@/app/u/[username]/specs/grid'
import { Specs } from '@/app/u/[username]/specs/specs'
import { Toolbar } from '@/app/u/[username]/specs/toolbar'
import { UserAvatarFollow } from '@/app/u/[username]/user-avatar-follow'
import { UserAvatarHeader } from '@/app/u/[username]/user-avatar-header'
import { Count } from '@/components/ui/count'
import { HorizontalScroller } from '@/components/ui/horizontal-scroller'
import { getSpecStock } from '@/lib/ingredient/get-spec-stock'
import { getFollowsByFollower } from '@/lib/model/follow'
import { getIngredientData } from '@/lib/model/ingredient-data'
import { getSpecs } from '@/lib/model/spec'
import {
  getManyUsers,
  getMostRecentActedUsers,
  getUserByID,
} from '@/lib/model/user'
import { getStockedBottleCount } from '@/lib/stock'
import { User } from '@/lib/types'
import { toDict } from '@/lib/utils'

type Props = {
  user: User
  criteria: Criteria
}

export async function SpecsContainer({ user, criteria: criteriaProp }: Props) {
  const { userId: currentUserID } = auth()

  const [currentUser, follows, currentUserFollows, userData, currentData] =
    await Promise.all([
      getUserByID(currentUserID),
      getFollowsByFollower(user.id),
      currentUserID && currentUserID !== user.id
        ? getFollowsByFollower(currentUserID)
        : Promise.resolve(undefined),
      getIngredientData(user.id),
      currentUserID && currentUserID !== user.id
        ? getIngredientData()
        : Promise.resolve(null),
    ])

  const currentFollows = currentUserFollows ?? follows

  const userIDs = [
    user.id,
    ...follows.filter(({ follows }) => follows).map(({ followee }) => followee),
  ]
  const currentFollowees = currentFollows
    .filter(({ follows }) => follows)
    .map(({ followee }) => followee)
  const exclude = currentUserID
    ? [currentUserID, user.id, ...currentFollowees]
    : []

  const [users, rawSpecs, usersToFollow] = await Promise.all([
    getManyUsers(userIDs),
    getSpecs(userIDs),
    getMostRecentActedUsers({ exclude }),
  ])

  const userDict = toDict(users, (u) => u.username)

  const data = currentData ?? userData
  const getStock = getSpecStock(data.dict, data.tree)
  const allSpecs = rawSpecs.map((spec) => ({ ...spec, stock: getStock(spec) }))

  const criteria = currentUser
    ? criteriaProp
    : { ...criteriaProp, sort: criteriaProp.sort ?? 'updated' }

  const specs = applyCriteria(data, allSpecs, criteria)

  const bottleCount = getStockedBottleCount(userData.dict)
  const specCount = specs.filter(({ userID }) => userID === user.id).length
  const followingCount = follows.filter(({ follows }) => follows).length

  const filters = (
    <FiltersContainer userDict={userDict} data={data} criteria={criteria} />
  )

  return (
    <Specs
      user={user}
      currentUser={currentUser}
      header={
        <>
          <UserAvatarHeader
            user={user}
            specCount={specCount}
            bottleCount={bottleCount}
            followingCount={followingCount}
          >
            {currentUserID && currentUserID !== user.id && (
              <FollowButton
                username={user.username}
                follow={currentFollows.find(
                  ({ followee }) => followee === user.id,
                )}
              />
            )}
          </UserAvatarHeader>
          {usersToFollow.length > 0 && (
            <div className="!col-span-full lg:hidden">
              <HorizontalScroller
                className="px-4 sm:px-6 lg:hidden [&:empty]:hidden"
                countInView={[2, 3, 4]}
              >
                {usersToFollow.map((user) => (
                  <UserAvatarFollow key={user.id} user={user} />
                ))}
              </HorizontalScroller>
            </div>
          )}
        </>
      }
      toolbar={<Toolbar {...criteria} />}
      filters={filters}
      sidebar={
        usersToFollow.length > 0 && (
          <div className="flex flex-col gap-4">
            {usersToFollow.map((user) => (
              <UserAvatarFollow key={user.id} user={user} />
            ))}
          </div>
        )
      }
      status={
        <span>
          <Count count={specs.length} total={allSpecs.length} /> specs
        </span>
      }
    >
      <Grid
        data={data}
        specs={specs}
        userDict={userDict}
        criteria={criteria}
        count={specs.length}
        showStock={Boolean(currentUser)}
      />
    </Specs>
  )
}
