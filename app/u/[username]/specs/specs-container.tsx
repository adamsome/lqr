import invariant from 'tiny-invariant'

import { applyCriteria } from '@/app/u/[username]/specs/_criteria/apply'
import { Criteria } from '@/app/u/[username]/specs/_criteria/types'
import { Count } from '@/app/u/[username]/specs/count'
import { FiltersContainer } from '@/app/u/[username]/specs/filters-container'
import { Grid } from '@/app/u/[username]/specs/grid'
import { Specs } from '@/app/u/[username]/specs/specs'
import { Toolbar } from '@/app/u/[username]/specs/toolbar'
import { UserAvatarHeader } from '@/app/u/[username]/user-avatar-header'
import {
  MdHorizontalScroller,
  UsersToFollow,
} from '@/app/u/[username]/users-to-follow'
import { getSpecStock } from '@/lib/ingredient/get-spec-stock'
import { getAllFollowing } from '@/lib/model/follow'
import { getIngredientData } from '@/lib/model/ingredient-data'
import { getSpecs } from '@/lib/model/spec'
import { getCurrentUser, getManyUsers } from '@/lib/model/user'
import { toDict } from '@/lib/utils'

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
    getManyUsers(userIDs),
    getSpecs(userIDs),
  ])

  const getStock = getSpecStock(data.dict, data.tree)
  const allSpecs = rawSpecs.map((spec) => ({ ...spec, stock: getStock(spec) }))

  const criteria = currentUser
    ? criteriaProp
    : { ...criteriaProp, sort: criteriaProp.sort ?? 'updated' }

  const specs = applyCriteria(data, allSpecs, criteria)

  const specCount = allSpecs.filter(({ userID }) => userID === userID).length

  const userDict = toDict(users, (u) => u.username)
  const filters = <FiltersContainer userDict={userDict} criteria={criteria} />

  return (
    <Specs
      username={username}
      header={
        <>
          <UserAvatarHeader username={username} counts={{ specs: specCount }} />
          <UsersToFollow username={username} Wrapper={MdHorizontalScroller} />
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
