import {
  CATEGORY_KEY,
  INGREDIENT_KEY,
  SEARCH_KEY,
  USER_KEY,
} from '@/app/specs/consts'
import { Count } from '@/app/specs/count'
import { Filters, UserState } from '@/app/specs/filters'
import { Grid } from '@/app/specs/grid'
import { Toolbar } from '@/app/specs/toolbar'
import { Button } from '@/components/ui/button'
import { H1 } from '@/components/ui/h1'
import { getAllSpecsData } from '@/lib/model/spec-data'
import Link from 'next/link'
import { sortBy } from 'ramda'

type Props = {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function Page({ searchParams }: Props) {
  const { specs: allSpecs, userDict, data } = await getAllSpecsData()
  const getValues = getSearchParamValues(searchParams)

  const search = getValues(SEARCH_KEY)[0] ?? ''
  const categories = getValues(CATEGORY_KEY)
  const users = getValues(USER_KEY)
  const ingredients = getValues(INGREDIENT_KEY)

  let specs = allSpecs
  if (search) {
    const words = search.toLowerCase().split(' ')
    specs = specs.filter((s) => {
      const name = s.name.toLowerCase()
      return words.some((w) => name.includes(w))
    })
  }
  if (categories.length) {
    specs = specs.filter((s) => categories.includes(s.category))
  }
  if (users.length) {
    specs = specs.filter((u) => users.includes(u.username))
  }
  if (ingredients.length) {
    specs = specs.filter((s) =>
      ingredients.every((id) =>
        s.ingredients.some((it) => it.bottleID === id || it.id === id),
      ),
    )
  }

  const checkedUserDict = users.reduce<Record<string, UserState>>(
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
          Specs <Count count={specs.length} total={allSpecs.length} />
        </H1>
        <Link href="/specs/add">
          <Button>Add Spec</Button>
        </Link>
      </div>
      <div className="flex flex-col gap-6">
        <Toolbar search={search} />
        <div className="flex gap-6">
          <div className="w-60">
            <Filters
              data={data}
              categories={categories}
              users={userStates}
              ingredients={ingredients}
            />
          </div>
          <div className="flex flex-1 flex-col gap-4">
            <Grid data={data} specs={specs} />
          </div>
        </div>
      </div>
    </section>
  )
}

const getSearchParamValues =
  (searchParams: Props['searchParams']) => (name: string) => {
    const params = searchParams[name] ?? []
    return Array.isArray(params) ? params : [params]
  }
