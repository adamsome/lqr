import { auth, clerkClient } from '@clerk/nextjs'
import { PlusIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import { sortBy } from 'ramda'
import invariant from 'tiny-invariant'

import {
  DEFAULT_LIMIT,
  LIMIT_KEY,
  SORT_DESC_KEY,
  SORT_KEY,
  SpecSort,
} from '@/app/specs/consts'
import { Count } from '@/app/specs/count'
import { filterSpecs, parseFilterParams } from '@/app/specs/filter-specs'
import { FooterFilterDrawerButton } from '@/app/specs/footer-filter-drawer-button'
import { Grid } from '@/app/specs/grid'
import { SidebarFilters, UserState } from '@/app/specs/sidebar-filters'
import { sortSpecs } from '@/app/specs/sort-specs'
import { Toolbar } from '@/app/specs/toolbar'
import * as Layout from '@/components/responsive-layout'
import { Button } from '@/components/ui/button'
import { FullWidthContainer } from '@/components/ui/container'
import { H1 } from '@/components/ui/h1'
import { getAllSpecsData } from '@/lib/model/spec-data'
import { HOME } from '@/lib/routes'
import { head } from '@/lib/utils'

type Props = {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function Page({ searchParams }: Props) {
  const { userId: userID } = auth()
  // TODO: User URL `u` param to get specs
  invariant(userID, 'Must be logged in to view specs.')
  const { specs: allSpecs, userDict, data } = await getAllSpecsData(userID)
  const { username } = await clerkClient.users.getUser(userID)
  const user = userDict[username ?? '']

  // Sort & limit params
  const sort = head(searchParams[SORT_KEY] as SpecSort | SpecSort[] | undefined)
  const desc = Boolean(searchParams[SORT_DESC_KEY])
  const limit = Number(head(searchParams[LIMIT_KEY]) ?? DEFAULT_LIMIT)

  const filters = parseFilterParams(searchParams)
  let specs = filterSpecs(data, allSpecs, filters)
  const count = specs.length

  specs = sortSpecs(specs, sort, desc).slice(0, limit)

  const checkedUserDict = filters.users.reduce<Record<string, UserState>>(
    (acc, u) => ({ ...acc, [u]: { ...userDict[u], checked: true } }),
    { ...userDict },
  )
  const userStates = sortBy(
    (u) => u.username,
    Object.keys(checkedUserDict).map((u) => checkedUserDict[u]),
  )

  return (
    <Layout.Root>
      <Layout.Header title="Specs">
        <Layout.Back href={HOME} user={user} />
        <Layout.Actions>
          {/* TODO: Hide when logged in */}
          <Link href="/specs/add">
            <Button size="sm">
              <PlusIcon />
              <span className="ps-1 pe-1">Add</span>
            </Button>
          </Link>
        </Layout.Actions>
      </Layout.Header>

      <FullWidthContainer className="my-4 sm:my-6 flex flex-col gap-4">
        <H1 className="flex items-baseline gap-3">
          Specs{' '}
          <Count
            className="text-[75%] hidden sm:inline"
            count={count}
            total={allSpecs.length}
          />
        </H1>

        <div className="flex flex-col gap-6">
          <Toolbar search={filters.search} sort={sort} desc={desc} />

          <div className="flex gap-6">
            <SidebarFilters
              className="sticky top-18 self-stretch w-60 hidden sm:flex"
              data={data}
              categories={filters.categories}
              users={userStates}
              ingredients={filters.ingredients}
              clearSpacer
            />
            <div className="flex flex-1 flex-col gap-4">
              <Grid data={data} specs={specs} limit={limit} count={count} />
            </div>
          </div>
        </div>
      </FullWidthContainer>

      <Layout.Footer
        status={
          <span>
            <Count count={count} total={allSpecs.length} /> specs
          </span>
        }
      >
        <FooterFilterDrawerButton>
          <SidebarFilters
            className="w-full"
            data={data}
            categories={filters.categories}
            users={userStates}
            ingredients={filters.ingredients}
          />
        </FooterFilterDrawerButton>
        {/* TODO: Hide when logged in */}
        <Link href="/specs/add">
          <Button className="w-11 h-11" variant="link" size="xs">
            <PlusIcon className="w-6 h-6" />
          </Button>
        </Link>
      </Layout.Footer>
    </Layout.Root>
  )
}
