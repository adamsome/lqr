import { auth } from '@clerk/nextjs'

import { applyCriteria } from '@/app/u/[username]/specs/_criteria/apply'
import { Criteria } from '@/app/u/[username]/specs/_criteria/types'
import { FiltersContainer } from '@/app/u/[username]/specs/filters-container'
import { Grid } from '@/app/u/[username]/specs/grid'
import { Specs } from '@/app/u/[username]/specs/specs'
import { Toolbar } from '@/app/u/[username]/specs/toolbar'
import { UserAvatarHeader } from '@/app/u/[username]/user-avatar-header'
import { Count } from '@/components/ui/count'
import { getSpecStock } from '@/lib/ingredient/get-spec-stock'
import { getFollow, getFolloweeIDs } from '@/lib/model/follow'
import { getIngredientData } from '@/lib/model/ingredient-data'
import { getSpecs } from '@/lib/model/spec'
import { getManyUsers, getUserByID } from '@/lib/model/user'
import { Ingredient, User } from '@/lib/types'
import { toDict } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { FollowButton } from '@/app/u/[username]/follow-button'

const isStockedBottle = (dict: Record<string, Ingredient>) => (id: string) =>
  dict[id].ordinal !== undefined && (dict[id].stock ?? -1) >= 0

type Props = {
  user: User
  criteria: Criteria
}

export async function SpecsContainer({ user, criteria: criteriaProp }: Props) {
  const { userId: currentUserID } = auth()

  const [currentUser, follows, userFollow, data] = await Promise.all([
    getUserByID(currentUserID),
    getFolloweeIDs(user.id),
    currentUserID && currentUserID !== user.id
      ? getFollow({ followee: user.id, follower: currentUserID })
      : Promise.resolve(null),
    getIngredientData(),
  ])

  const userIDs = [user.id, ...follows.map(({ followee }) => followee)]

  const [users, rawSpecs] = await Promise.all([
    getManyUsers(userIDs),
    getSpecs(userIDs),
  ])

  const userDict = toDict(users, (u) => u.username)

  const { dict, tree } = data
  const getStock = getSpecStock(dict, tree)
  const allSpecs = rawSpecs.map((spec) => ({ ...spec, stock: getStock(spec) }))

  const criteria = currentUser
    ? criteriaProp
    : { ...criteriaProp, sort: criteriaProp.sort ?? 'updated' }

  const specs = applyCriteria(data, allSpecs, criteria)

  const bottleCount = Object.keys(dict).filter(isStockedBottle(dict)).length
  const specCount = specs.filter(({ userID }) => userID === user.id).length

  const filters = (
    <FiltersContainer userDict={userDict} data={data} criteria={criteria} />
  )

  return (
    <Specs
      user={user}
      currentUser={currentUser}
      header={
        <UserAvatarHeader
          user={user}
          specCount={specCount}
          bottleCount={bottleCount}
        >
          {currentUserID && currentUserID !== user.id && (
            <FollowButton username={user.username} follow={userFollow} />
          )}
        </UserAvatarHeader>
      }
      toolbar={<Toolbar {...criteria} />}
      filters={filters}
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
