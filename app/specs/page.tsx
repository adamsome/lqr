import {
  CATEGORY_KEY,
  INGREDIENT_KEY,
  SEARCH_KEY,
  SORT_DESC_KEY,
  SORT_KEY,
  SpecSort,
  USER_KEY,
} from '@/app/specs/consts'
import { Count } from '@/app/specs/count'
import { Filters, UserState } from '@/app/specs/filters'
import { Grid } from '@/app/specs/grid'
import { parseIngredientParam } from '@/app/specs/ingredient-param'
import { sortSpecs } from '@/app/specs/sort-specs'
import { Toolbar } from '@/app/specs/toolbar'
import { Button } from '@/components/ui/button'
import { H1 } from '@/components/ui/h1'
import {
  filterIngredientItems,
  testIngredientMethods,
} from '@/lib/ingredient/filter-ingredient-items'
import { getAllSpecsData } from '@/lib/model/spec-data'
import { rejectNil } from '@/lib/utils'
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
  const ingredients = rejectNil(
    getValues(INGREDIENT_KEY).map(parseIngredientParam),
  )
  const sort = searchParams[SORT_KEY] as SpecSort | undefined
  const desc = Boolean(searchParams[SORT_DESC_KEY])

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
    const filterItems = filterIngredientItems(data)
    const idsPerIngredient = ingredients.map((it) =>
      data.dict[it.id ?? '']?.ordinal
        ? // If specific bottle ingredient (i.e. has ordinal), only match it
          [it.id]
        : // Match against all descendent ingredients and bottles
          filterItems({ include: [it] }).map(({ id }) => id),
    )
    specs = specs.filter((s) =>
      // Spec must match every ingredient filter item
      idsPerIngredient.every((ids, i) =>
        // Within filter item + descendents, one must match a spec ingredient
        ids.some((id) =>
          s.ingredients.some(
            (it) =>
              it.bottleID === id ||
              // If filter item is not a specific bottle, test modifiers too
              (it.id === id && testIngredientMethods(ingredients[i], it)),
          ),
        ),
      ),
    )
  }

  specs = sortSpecs(specs, sort, desc)

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
        <Toolbar search={search} sort={sort} desc={desc} />
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
