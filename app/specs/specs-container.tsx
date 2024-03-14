import { getGlobalSpecs } from '@/app/lib/model/user-specs'
import { applyCriteria } from '@/app/u/[username]/specs/_criteria/apply'
import { Criteria } from '@/app/u/[username]/specs/_criteria/types'
import { Count } from '@/app/u/[username]/specs/count'
import { FiltersContainer } from '@/app/u/[username]/specs/filters-container'
import { Grid } from '@/app/u/[username]/specs/grid'
import { Specs } from '@/app/u/[username]/specs/specs'
import { Toolbar } from '@/app/u/[username]/specs/toolbar'
import { UsersToFollow } from '@/app/u/[username]/users-to-follow'
import { AppBack } from '../components/layout/app-layout'
import { toHome } from '../lib/routes'

type Props = {
  criteria: Criteria
}

export async function SpecsContainer({ criteria }: Props) {
  const username: string | undefined = undefined

  const { data, specs, userDict } = await getGlobalSpecs()

  const filteredSpecs = applyCriteria(data, specs, criteria)

  const filters = <FiltersContainer userDict={userDict} criteria={criteria} />

  return (
    <Specs
      username={username}
      header={
        <div className="overflow-hidden text-ellipsis whitespace-nowrap text-2xl font-bold tracking-tight sm:text-4xl">
          Specs
        </div>
      }
      backButton={<AppBack href={toHome()}>Back</AppBack>}
      title="Specs"
      toolbar={<Toolbar {...criteria} />}
      filters={filters}
      sidebar={<UsersToFollow username={username} />}
      status={<Count count={filteredSpecs.length} total={specs.length} />}
    >
      <Grid
        specs={filteredSpecs}
        userDict={userDict}
        criteria={criteria}
        count={filteredSpecs.length}
        showStock
      />
    </Specs>
  )
}
