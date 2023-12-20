import { sortBy } from 'ramda'

import { Criteria } from '@/app/u/[username]/specs/_criteria/types'
import { Filters, UserState } from '@/app/u/[username]/specs/filters'
import { IngredientData, User } from '@/lib/types'
import { cn } from '@/lib/utils'

type Props = {
  userDict: Record<string, User>
  data: IngredientData
  criteria: Criteria
}

export function FiltersContainer({ userDict, data, criteria }: Props) {
  const checkedUserDict = criteria.users.reduce<Record<string, UserState>>(
    (acc, u) => ({ ...acc, [u]: { ...userDict[u], checked: true } }),
    { ...userDict },
  )
  const userStates = sortBy(
    (u) => u.username,
    Object.keys(checkedUserDict).map((u) => checkedUserDict[u]),
  )
  return (
    <Filters
      className={cn(
        'w-full max-h-screen [&>*]:self-stretch',
        'sm:sticky sm:top-18 sm:pt-1 sm:w-60 sm:[&>*:last-child]:min-h-[132px]',
      )}
      data={data}
      criteria={criteria}
      users={userStates}
    />
  )
}
