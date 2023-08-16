import Link from 'next/link'
import { sortBy } from 'ramda'

import {
  DEFAULT_LIMIT,
  LIMIT_KEY,
  SORT_DESC_KEY,
  SORT_KEY,
  SpecSort,
} from '@/app/specs/consts'
import { Count } from '@/app/specs/count'
import { filterSpecs, parseFilterParams } from '@/app/specs/filter-specs'
import { Filters, UserState } from '@/app/specs/filters'
import { Grid } from '@/app/specs/grid'
import { sortSpecs } from '@/app/specs/sort-specs'
import { Toolbar } from '@/app/specs/toolbar'
import { Button } from '@/components/ui/button'
import { H1 } from '@/components/ui/h1'
import { getAllSpecsData } from '@/lib/model/spec-data'
import { head } from '@/lib/utils'

type Props = {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function Page({ searchParams }: Props) {
  const { specs: allSpecs, userDict, data } = await getAllSpecsData()

  // Sort & limit params
  const sort = head(searchParams[SORT_KEY] as SpecSort | SpecSort[] | undefined)
  const desc = Boolean(searchParams[SORT_DESC_KEY])
  const limit = Number(head(searchParams[LIMIT_KEY]) ?? DEFAULT_LIMIT)

  const filters = parseFilterParams(searchParams)
  let specs = filterSpecs(data, allSpecs, filters)
  const count = specs.length

  specs = sortSpecs(specs, sort, desc).slice(0, limit)

  const checkedUserDict = filters.users.reduce<Record<string, UserState>>(
    (acc, username) => {
      acc[username] = { ...userDict[username], checked: true }
      return acc
    },
    { ...userDict },
  )
  const userStates = sortBy(
    (u) => u.username,
    Object.keys(checkedUserDict).map((username) => checkedUserDict[username]),
  )

  return (
    <section className="relative my-8 flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <H1 className="flex-1 flex items-baseline gap-3">
          Specs <Count count={count} total={allSpecs.length} />
        </H1>
        <Link href="/specs/add">
          <Button>Add Spec</Button>
        </Link>
      </div>
      <div className="flex flex-col gap-6">
        <Toolbar search={filters.search} sort={sort} desc={desc} />
        <div className="flex gap-6">
          <div className="w-60">
            <Filters
              data={data}
              categories={filters.categories}
              users={userStates}
              ingredients={filters.ingredients}
            />
          </div>
          <div className="flex flex-1 flex-col gap-4">
            <Grid data={data} specs={specs} limit={limit} count={count} />
          </div>
        </div>
      </div>
    </section>
  )
}
