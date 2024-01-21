import invariant from 'tiny-invariant'

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
  getCurrentUser,
} from '@/lib/model/user'
import { toDict } from '@/lib/utils'

type Props = {
  username?: string
  criteria: Criteria
}

export async function SpecsContainer({
  username,
  criteria: criteriaProp,
}: Props) {
  const { user, currentUser, isCurrentUser } = await getCurrentUser(username)

  invariant(user && username, `User not found.`)

  const { id: userID } = user

  const [follows, currentUserFollows, userData, currentData] =
    await Promise.all([
      getFollowsByFollower(userID),
      currentUser && !isCurrentUser
        ? getFollowsByFollower(currentUser?.id)
        : Promise.resolve(undefined),
      getIngredientData(userID),
      currentUser && !isCurrentUser
        ? getIngredientData()
        : Promise.resolve(null),
    ])

  const currentFollows = currentUserFollows ?? follows

  const userIDs = [
    userID,
    ...follows.filter(({ follows }) => follows).map(({ followee }) => followee),
  ]
  const currentFollowees = currentFollows
    .filter(({ follows }) => follows)
    .map(({ followee }) => followee)
  const exclude = currentUser
    ? [currentUser.id, userID, ...currentFollowees]
    : []

  const [users, rawSpecs, usersToFollow] = await Promise.all([
    getManyUsers(userIDs),
    getSpecs(userIDs),
    currentUser ? getMostRecentActedUsers({ exclude }) : Promise.resolve([]),
  ])

  const userDict = toDict(users, (u) => u.username)

  const data = currentData ?? userData
  const getStock = getSpecStock(data.dict, data.tree)
  const allSpecs = rawSpecs.map((spec) => ({ ...spec, stock: getStock(spec) }))

  const criteria = currentUser
    ? criteriaProp
    : { ...criteriaProp, sort: criteriaProp.sort ?? 'updated' }

  const specs = applyCriteria(data, allSpecs, criteria)

  const specCount = rawSpecs.filter(({ userID }) => userID === userID).length

  const filters = (
    <FiltersContainer userDict={userDict} data={data} criteria={criteria} />
  )

  return (
    <Specs
      user={user}
      currentUser={currentUser}
      header={
        <>
          <UserAvatarHeader username={username} counts={{ specs: specCount }}>
            {currentUser && !isCurrentUser && (
              <FollowButton
                username={username}
                follow={currentFollows.find(
                  ({ followee }) => followee === userID,
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
                  <UserAvatarFollow key={userID} user={user} />
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
              <UserAvatarFollow key={userID} user={user} />
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
