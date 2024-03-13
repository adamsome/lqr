import { sortBy } from 'ramda'

import { getIngredientData } from '@/app/lib/model/ingredient-data'
import { User } from '@/app/lib/types'
import { cn } from '@/app/lib/utils'
import { Criteria } from '@/app/u/[username]/specs/_criteria/types'
import { BarFilter } from '@/app/u/[username]/specs/bar-filter'
import { Filters, UserState } from '@/app/u/[username]/specs/filters'

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
  ).slice(0, 10)

  return (
    <Filters
      className={cn(
        'max-h-[calc(100vh-148px)] w-full [&>*]:self-stretch',
        'sm:top-18 sm:sticky sm:pt-1',
        'sm:w-[theme(spacing.88)]',
        'md:w-[clamp(theme(spacing.88),45vw,theme(spacing.112))]',
        'sm:[&>*:last-child]:min-h-[132px]',
      )}
      data={data}
      criteria={criteria}
      users={userStates}
      bar={<BarFilter username={criteria.username} />}
    />
  )
}
