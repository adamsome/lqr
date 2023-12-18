import { sortBy } from 'ramda'

import { applyCriteria } from '@/app/u/[username]/specs/_criteria/apply'
import { Criteria } from '@/app/u/[username]/specs/_criteria/types'
import { UserState } from '@/app/u/[username]/specs/sidebar-filters'
import { Specs } from '@/app/u/[username]/specs/specs'
import { getSpecStock } from '@/lib/ingredient/get-spec-stock'
import { getFolloweeIDs } from '@/lib/model/follow'
import { getIngredientData } from '@/lib/model/ingredient-data'
import { getSpecs } from '@/lib/model/spec'
import { getManyUsers } from '@/lib/model/user'
import { User } from '@/lib/types'
import { toIDMap } from '@/lib/utils'

type Props = {
  user: User
  criteria: Criteria
}

export async function SpecsContainer({ user, criteria }: Props) {
  const userIDs = await getFolloweeIDs(user.id)

  const [users, data, rawSpecs] = await Promise.all([
    getManyUsers(userIDs),
    getIngredientData(),
    getSpecs(userIDs),
  ])

  const { dict, tree } = data
  const userDict = toIDMap(users, (u) => u.username)

  const getStock = getSpecStock(dict, tree)
  const allSpecs = rawSpecs.map((spec) => ({ ...spec, stock: getStock(spec) }))

  const specs = applyCriteria(data, allSpecs, criteria)

  const checkedUserDict = criteria.users.reduce<Record<string, UserState>>(
    (acc, u) => ({ ...acc, [u]: { ...userDict[u], checked: true } }),
    { ...userDict },
  )
  const userStates = sortBy(
    (u) => u.username,
    Object.keys(checkedUserDict).map((u) => checkedUserDict[u]),
  )

  return (
    <Specs
      specs={specs}
      user={user}
      data={data}
      userStates={userStates}
      criteria={criteria}
      total={allSpecs.length}
    />
  )
}
