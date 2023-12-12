import { uniq } from 'ramda'

import { AddCommand } from '@/app/bar/add-command'
import { BarCategory, Category } from '@/app/bar/category'
import { Count } from '@/app/specs/count'
import { IngredientDataProvider } from '@/components/data-provider'
import * as Layout from '@/components/responsive-layout'
import { Container } from '@/components/ui/container'
import { H1 } from '@/components/ui/h1'
import { H2 } from '@/components/ui/h2'
import { HierarchicalFilter } from '@/lib/hierarchical-filter'
import {
  IngredientItem,
  filterIngredientItems,
} from '@/lib/ingredient/filter-ingredient-items'
import { getIngredientName } from '@/lib/ingredient/get-ingredient-name'
import { INGREDIENT_KINDS, IngredientKind } from '@/lib/ingredient/kind'
import {
  KIND_INGREDIENT_DICT,
  KIND_MORE_INGREDIENT_TYPES,
} from '@/lib/ingredient/kind-ingredients'
import { getIngredientData } from '@/lib/model/ingredient-data'
import { getOneUser } from '@/lib/model/user'
import { HOME } from '@/lib/routes'
import { IngredientData } from '@/lib/types'
import { cn, rejectNil } from '@/lib/utils'
import { auth } from '@clerk/nextjs'
import { PlusIcon } from '@radix-ui/react-icons'
import invariant from 'tiny-invariant'

export const revalidate = 0

type Section = Partial<Omit<BarCategory, 'ingredients'>> & {
  ids?: string[]
  kind?: IngredientKind
}

const spiritSections: Section[] = [
  { include: [{ id: 'grain_whiskey_rye' }] },
  { include: [{ id: 'grain_gin' }] },
  { include: [{ id: 'fortifiedwine_dryvermouth' }] },
  { kind: 'bitters', rowSpan: 2 },
  { include: [{ id: 'brandy_grape_cognac' }] },
  { include: [{ id: 'agave_tequila' }] },
  { include: [{ id: 'fortifiedwine_sweetvermouth' }] },
  { include: [{ id: 'grain_whiskey_scotch' }] },
  { include: [{ id: 'agave_mezcal' }] },
  { include: [{ id: 'liqueur_amaro_aperitivo' }] },
  { include: [{ id: 'liqueur_absinthe' }] },
  { include: [{ id: 'grain_whiskey_bourbon' }] },
  { include: [{ id: 'brandy_apple' }] },
  { include: [{ id: 'liqueur_orange' }] },
  { include: [{ id: 'liqueur_maraschino' }] },
  { include: [{ id: 'grain_whiskey_irish' }] },
  {
    name: 'Other Whisky',
    include: [{ id: 'grain_whiskey_irish' }],
    exclude: [
      { id: 'grain_whiskey_rye' },
      { id: 'grain_whiskey_scotch' },
      { id: 'grain_whiskey_bourbon' },
      { id: 'grain_whiskey_irish' },
    ],
  },
  {
    name: 'Chartreuse',
    ids: ['green_chartreuse', 'yellow_chartreuse'],
  },
  { name: 'Benedictine', ids: ['benedictine'] },
  { include: [{ id: 'cane_rum_jamaican', black: false }] },
  { include: [{ id: 'cane_rum_demerara', overproof: false, black: false }] },
  {
    name: 'Other Rum',
    include: [{ id: 'cane_rum' }],
    exclude: [
      { id: 'cane_rum', black: true },
      { id: 'cane_rum', overproof: true },
      { id: 'cane_rum_jamaican', black: false },
      { id: 'cane_rum_demerara', overproof: false, black: false },
      { id: 'cane_rum_agricole' },
    ],
    rowSpan: 2,
  },
  {
    name: 'Falernum',
    ids: ['john_d_taylors_velvet_falernum'],
  },
  { include: [{ id: 'cane_rum_agricole' }] },
  {
    name: 'Black & Overproof Rum',
    include: [
      { id: 'cane_rum', black: true },
      { id: 'cane_rum', overproof: true },
    ],
    exclude: [
      { id: 'cane_rum_jamaican', black: false },
      { id: 'cane_rum_demerara', overproof: false, black: false },
      { id: 'cane_rum_agricole' },
    ],
  },
  {
    name: 'Allspice Dram',
    ids: ['st_elizabeth_allspice_dram'],
  },
  {
    name: 'Amari',
    include: [{ id: 'liqueur_amaro' }],
    exclude: [{ id: 'liqueur_amaro_aperitivo' }],
  },
  {
    name: 'Fortified Wine',
    include: [{ id: 'fortifiedwine' }],
    exclude: [
      { id: 'fortifiedwine_dryvermouth' },
      { id: 'fortifiedwine_sweetvermouth' },
    ],
  },
  {
    include: [{ id: 'liqueur' }],
    exclude: [
      { id: 'liqueur_amaro' },
      { id: 'liqueur_absinthe' },
      { id: 'liqueur_orange' },
      { id: 'liqueur_maraschino' },
    ],
    excludeIDs: [
      'green_chartreuse',
      'yellow_chartreuse',
      'benedictine',
      'john_d_taylors_velvet_falernum',
      'st_elizabeth_allspice_dram',
    ],
  },
]

const ingredientSections: Section[] = [
  { kind: 'juice', rowSpan: 2 },
  { kind: 'syrup', rowSpan: 2 },
  { kind: 'soda', rowSpan: 2 },
  { kind: 'dairy' },
  { kind: 'garnish' },
]

function createTree(
  items: IngredientItem[],
  excl?: Set<string>,
): HierarchicalFilter {
  const root: HierarchicalFilter = {
    id: 'all',
    checked: false,
    childIDs: [],
    children: {},
  }
  for (const { id: ingredientID, path } of items) {
    let node = root
    for (const id of path) {
      if (!node.children[id]) {
        node.childIDs.push(id)
        const checked = excl?.has(id) ?? false
        node.children[id] = { id, checked, childIDs: [], children: {} }
      }
      node = node.children[id]
    }
    if (node.id !== ingredientID && !excl?.has(ingredientID)) {
      if (!node.bottleIDs) node.bottleIDs = []
      node.bottleIDs.push(ingredientID)
    }
  }
  return root
}

const createCategoryParser = (data: IngredientData) => {
  const { dict, tree } = data
  const getItems = filterIngredientItems({ dict, tree })
  const getName = getIngredientName(dict)

  return (allStocked: Set<string>) =>
    (section: Section): BarCategory => {
      const { include: incl, exclude, ids = [], kind, excludeIDs } = section
      const include = incl ?? []
      const exclIDs = new Set(excludeIDs ?? [])
      let name: string | undefined
      let topIDs = ids

      if (kind) {
        name = INGREDIENT_KINDS.find(({ value }) => value === kind)?.label
        const kindItems = KIND_INGREDIENT_DICT[kind] ?? []
        const kindIDs = kindItems.map(({ id, bottleID }) => bottleID ?? id)
        topIDs.push(...uniq(rejectNil(kindIDs)))
        topIDs.forEach((id) => exclIDs.add(id))
        const [, moreIngredients = []] =
          KIND_MORE_INGREDIENT_TYPES.find(([moreKind]) => moreKind === kind) ??
          []
        include.push(...moreIngredients.map(({ category: id }) => ({ id })))
      }

      const allItems = getItems({ include, exclude }) ?? []
      const items = allItems.filter((it) => !exclIDs.has(it.id))
      const stockedIDs = topIDs
        .concat(items.map(({ id }) => id))
        .filter((id) => (dict[id]?.stock ?? -1) >= 0)

      const excludeSet = new Set(stockedIDs)
      const root = createTree(items, excludeSet)
      topIDs = topIDs.filter((id) => !excludeSet.has(id))

      const stocked = stockedIDs
        // Remove any that have already been added in previous categories
        .filter((id) => allStocked.has(id))
        .map((id) => dict[id])
      stockedIDs.forEach((id) => {
        allStocked.delete(id)
      })

      const topItems = topIDs.map((id) => {
        const def = dict[id] ?? {}
        const name = getName(def)
        return { ...def, name }
      })

      name =
        name ??
        section.name ??
        getName(include?.[0] ?? {}, { inclCategory: true })

      return { ...section, stocked, root, topItems, name }
    }
}

export default async function Page() {
  const { userId: currentUserID } = auth()
  // TODO: Use URL `u` param to get user bar
  const userID = currentUserID
  const user = await getOneUser(userID)

  // TODO: Show "User not found"
  invariant(user, `User not found.`)

  const data = await getIngredientData()
  const { dict } = data

  const stocked = new Set<string>(
    Object.keys(dict).filter((id) => (dict[id].stock ?? -1) >= 0),
  )
  const allStocked = new Set<string>(
    Object.keys(dict).filter((id) => (dict[id].stock ?? -1) >= 0),
  )
  const count = allStocked.size

  const toCategory = createCategoryParser(data)

  const spiritCategories = spiritSections.map(toCategory(stocked))
  const ingredientCategories = ingredientSections.map(toCategory(stocked))

  spiritCategories.push({
    name: 'Other Spirits',
    stocked: Array.from(stocked)
      .map((id) => dict[id])
      .filter((it) => it.ordinal !== undefined),
  })

  return (
    <IngredientDataProvider {...data}>
      <Layout.Root>
        <Layout.Header title="Bar">
          <Layout.Back href={HOME} user={user} />
          <Layout.Actions>
            {userID === currentUserID && (
              <AddCommand size="sm" stocked={allStocked}>
                <PlusIcon />
                <span className="ps-1 pe-1">Add</span>
              </AddCommand>
            )}
          </Layout.Actions>
        </Layout.Header>

        <Container className="relative py-4 sm:py-6">
          <section className="flex flex-col gap-6 sm:gap-8">
            <div className="flex flex-col gap-4">
              <H1 className="flex items-baseline gap-3">
                Bar{' '}
                <Count className="text-[75%] hidden sm:inline" count={count} />
              </H1>

              <div
                className={cn(
                  'grid gap-x-4 gap-y-4 lg:gap-x-6 lg:gap-y-8',
                  'grid-cols-[repeat(auto-fill,minmax(theme(spacing.64),1fr))]',
                )}
              >
                {spiritCategories.map((c, i) => (
                  <Category key={c.name ?? i} category={c} muteItems />
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <H2>Non-alcoholic</H2>
              <div
                className={cn(
                  'grid gap-x-4 gap-y-4 lg:gap-x-6 lg:gap-y-8',
                  'grid-cols-[repeat(auto-fill,minmax(theme(spacing.64),1fr))]',
                )}
              >
                {ingredientCategories.map((c, i) => (
                  <Category key={c.name ?? i} category={c} />
                ))}
              </div>
            </div>
          </section>
        </Container>

        <Layout.Footer
          status={
            <span>
              <Count count={count} total={count} /> items
            </span>
          }
        >
          <div />
          {userID === currentUserID && (
            <AddCommand
              className="w-11 h-11"
              variant="link"
              size="xs"
              stocked={allStocked}
            >
              <PlusIcon className="w-6 h-6" />
            </AddCommand>
          )}
        </Layout.Footer>
      </Layout.Root>
    </IngredientDataProvider>
  )
}
