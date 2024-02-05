import invariant from 'tiny-invariant'

import { UserAvatarHeader } from '@/app/components/user/user-avatar-header'
import { getSpecStock } from '@/app/lib/ingredient/get-spec-stock'
import { getAllFollowing } from '@/app/lib/model/follow'
import { getIngredientData } from '@/app/lib/model/ingredient-data'
import { getAllSpecsWithUserIDs } from '@/app/lib/model/spec'
import { getAllUsers, getCurrentUser } from '@/app/lib/model/user'
import { toDict } from '@/app/lib/utils'
import { applyCriteria } from '@/app/u/[username]/specs/_criteria/apply'
import { Criteria } from '@/app/u/[username]/specs/_criteria/types'
import { Count } from '@/app/u/[username]/specs/count'
import { FiltersContainer } from '@/app/u/[username]/specs/filters-container'
import { Grid } from '@/app/u/[username]/specs/grid'
import { Specs } from '@/app/u/[username]/specs/specs'
import { Toolbar } from '@/app/u/[username]/specs/toolbar'
import {
  MobileHorizontalScroller,
  UsersToFollow,
} from '@/app/u/[username]/users-to-follow'

type Props = {
  username?: string
  criteria: Criteria
}

export async function SpecsContainer({
  username,
  criteria: criteriaProp,
}: Props) {
  const { user, currentUser } = await getCurrentUser(username)

  invariant(user && username, `User not found.`)

  const { id: userID } = user

  const [follows, data] = await Promise.all([
    getAllFollowing(userID),
    getIngredientData(),
  ])

  const userIDs = [
    userID,
    ...follows.filter(({ follows }) => follows).map(({ followee }) => followee),
  ]

  const [users, rawSpecs] = await Promise.all([
    getAllUsers(userIDs),
    getAllSpecsWithUserIDs(userIDs),
  ])

  const getStock = getSpecStock(data.dict, data.tree)
  const allSpecs = rawSpecs.map((spec) => ({ ...spec, stock: getStock(spec) }))

  const criteria = currentUser
    ? criteriaProp
    : { ...criteriaProp, sort: criteriaProp.sort ?? 'updated' }

  const specs = applyCriteria(data, allSpecs, criteria)

  const userDict = toDict(users, (u) => u.username)
  const filters = <FiltersContainer userDict={userDict} criteria={criteria} />

  return (
    <Specs
      username={username}
      header={
        <>
          <UserAvatarHeader selected="specs" username={username} />
          <UsersToFollow
            username={username}
            Wrapper={MobileHorizontalScroller}
          />
        </>
      }
      toolbar={<Toolbar {...criteria} />}
      filters={filters}
      sidebar={<UsersToFollow username={username} />}
      status={<Count count={specs.length} total={allSpecs.length} />}
    >
      <Grid
        specs={specs}
        userDict={userDict}
        criteria={criteria}
        count={specs.length}
        showStock={Boolean(currentUser)}
      />
    </Specs>
  )
}
