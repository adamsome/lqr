import { sortBy } from 'ramda'

import { Criteria } from '@/app/u/[username]/specs/_criteria/types'
import {
  SidebarFilters,
  UserState,
} from '@/app/u/[username]/specs/sidebar-filters'
import { IngredientData, User } from '@/lib/types'
import { toIDMap } from '@/lib/utils'

type Props = {
  users: User[]
  data: IngredientData
  criteria: Criteria
}

export function FiltersContainer({ users, data, criteria }: Props) {
  const userDict = toIDMap(users, (u) => u.username)
  const checkedUserDict = criteria.users.reduce<Record<string, UserState>>(
    (acc, u) => ({ ...acc, [u]: { ...userDict[u], checked: true } }),
    { ...userDict },
  )
  const userStates = sortBy(
    (u) => u.username,
    Object.keys(checkedUserDict).map((u) => checkedUserDict[u]),
  )
  return (
    <SidebarFilters
      className="sm:sticky sm:top-18 sm:w-60 sm:[&>*:last-child]:min-h-[132px]"
      data={data}
      criteria={criteria}
      users={userStates}
    />
  )
}
