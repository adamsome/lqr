import { auth, clerkClient } from '@clerk/nextjs'
import { Pencil2Icon } from '@radix-ui/react-icons'
import Link from 'next/link'
import { sortBy } from 'ramda'
import invariant from 'tiny-invariant'

import {
  DEFAULT_LIMIT,
  LIMIT_KEY,
  SORT_DESC_KEY,
  SORT_KEY,
  SpecSort,
} from '@/app/u/[username]/specs/consts'
import { Count } from '@/app/u/[username]/specs/count'
import {
  filterSpecs,
  parseFilterParams,
} from '@/app/u/[username]/specs/filter-specs'
import { FooterFilterDrawerButton } from '@/app/u/[username]/specs/footer-filter-drawer-button'
import { Grid } from '@/app/u/[username]/specs/grid'
import {
  SidebarFilters,
  UserState,
} from '@/app/u/[username]/specs/sidebar-filters'
import { sortSpecs } from '@/app/u/[username]/specs/sort-specs'
import { Toolbar } from '@/app/u/[username]/specs/toolbar'
import * as Layout from '@/components/responsive-layout'
import { Button, IconButton } from '@/components/ui/button'
import { FullWidthContainer } from '@/components/ui/container'
import { H1 } from '@/components/ui/h1'
import { getAllSpecsData } from '@/lib/model/spec-data'
import { toHome, toSpecAdd } from '@/lib/routes'
import { head } from '@/lib/utils'
import { getUser } from '@/lib/model/user'

type Props = {
  params: {
    username: string
  }
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

export default async function Page({ params, searchParams }: Props) {
  const { username } = params

  const { userId: currentUserID } = auth()

  const user = await getUser(username)

  // TODO: Show "User not found"
  invariant(user, `User not found.`)

  const isCurrentUser = user.id == currentUserID
  const addUrl = toSpecAdd(user.username)

  const { specs: allSpecs, userDict, data } = await getAllSpecsData(user)

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
        <Layout.Back href={toHome(user.username)} user={user} />
        <Layout.Actions>
          {isCurrentUser && (
            <Link href={addUrl}>
              <Button size="sm">
                <Pencil2Icon />
                <span className="ps-1.5 pe-1">Create</span>
              </Button>
            </Link>
          )}
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
              <Grid
                data={data}
                specs={specs}
                limit={limit}
                count={count}
                usernameParam={username}
              />
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
        {isCurrentUser && (
          <Link href={addUrl}>
            <IconButton>
              <Pencil2Icon className="w-6 h-6" />
            </IconButton>
          </Link>
        )}
      </Layout.Footer>
    </Layout.Root>
  )
}
