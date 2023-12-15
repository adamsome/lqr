import { auth } from '@clerk/nextjs'

import { Criteria } from '@/app/u/[username]/specs/_criteria/types'
import { Grid } from '@/app/u/[username]/specs/grid'
import {
  SidebarFilters,
  UserState,
} from '@/app/u/[username]/specs/sidebar-filters'
import { Toolbar } from '@/app/u/[username]/specs/toolbar'
import { Wrapper } from '@/app/u/[username]/specs/wrapper'
import { Count } from '@/components/ui/count'
import { H1 } from '@/components/ui/h1'
import { IngredientData, Spec, User } from '@/lib/types'

type Props = {
  specs: Spec[]
  user: User
  data: IngredientData
  userStates: UserState[]
  criteria: Criteria
  total: number
}

export async function Specs({
  specs,
  user,
  data,
  userStates,
  criteria,
  total,
}: Props) {
  const { userId: currentUserID } = auth()
  return (
    <Wrapper
      user={user}
      isCurrentUser={user.id === currentUserID}
      filters={
        <SidebarFilters
          className="w-full"
          data={data}
          criteria={criteria}
          users={userStates}
        />
      }
      status={
        <span>
          <Count count={specs.length} total={total} /> specs
        </span>
      }
    >
      <H1 className="flex items-baseline gap-3">
        Specs{' '}
        <Count
          className="text-[75%] hidden sm:inline"
          count={specs.length}
          total={total}
        />
      </H1>

      <div className="flex flex-col gap-6">
        <Toolbar {...criteria} />

        <div className="flex gap-6">
          <SidebarFilters
            className="sticky top-18 self-stretch w-60 hidden sm:flex"
            data={data}
            criteria={criteria}
            users={userStates}
            clearSpacer
          />
          <div className="flex flex-1 flex-col gap-4">
            <Grid
              data={data}
              specs={specs}
              criteria={criteria}
              count={specs.length}
              showStock={Boolean(currentUserID)}
            />
          </div>
        </div>
      </div>
    </Wrapper>
  )
}
