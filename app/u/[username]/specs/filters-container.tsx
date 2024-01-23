import { sortBy } from 'ramda'

import { Criteria } from '@/app/u/[username]/specs/_criteria/types'
import { Filters, UserState } from '@/app/u/[username]/specs/filters'
import { getIngredientData } from '@/app/lib/model/ingredient-data'
import { User } from '@/app/lib/types'
import { cn } from '@/app/lib/utils'

type Props = {
  userDict: Record<string, User>
  criteria: Criteria
}

export async function FiltersContainer({ userDict, criteria }: Props) {
  const data = await getIngredientData()

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
