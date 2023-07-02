import { uniq } from 'ramda'

import { BarCategory, Category } from '@/app/bar/category'
import { DataProvider } from '@/components/data-provider'
import { Container } from '@/components/ui/container'
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
import { getData } from '@/lib/model/data'
import { Data, Ingredient, IngredientDef } from '@/lib/types'
import { cn, rejectNil } from '@/lib/utils'

type Section = Partial<Omit<BarCategory, 'ingredients'>> & {
  ids?: string[]
  kind?: IngredientKind
}

const spiritSections: Section[] = [
  { include: [{ id: 'grain_whiskey_rye' }] },
  { include: [{ id: 'grain_gin' }] },
  { include: [{ id: 'fortifiedwine_dryvermouth' }] },
  { include: [{ id: 'bitters' }], rowSpan: 2 },
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
  // other brandies
  // other vermouth
  // fortified wine
  // liqueurs

  // beer
  // wine
]

const ingredientSections: Section[] = [
  { kind: 'juice', rowSpan: 2 },
  { kind: 'syrup', rowSpan: 2 },
  { kind: 'soda', rowSpan: 2 },
  { kind: 'dairy' },
  { kind: 'garnish' },
]

function getStocked(
  dict: Record<string, IngredientDef | Ingredient>
): string[] {
  return Object.keys(dict).filter((id) => (dict[id].stock ?? -1) >= 0)
}

function createTree(
  items: IngredientItem[],
  excl?: Set<string>
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

const createCategoryParser = (data: Data) => {
  const { baseIngredientDict, ingredientDict } = data
  const getItems = filterIngredientItems(data)
  const getName = getIngredientName(baseIngredientDict, ingredientDict)

  return (allStocked: Set<string>) =>
    (section: Section): BarCategory => {
      const { include: incl, exclude, ids = [], kind, excludeIDs } = section
      const include = incl ?? []
      const exclIDs = new Set(excludeIDs ?? [])
      let name: string | undefined
      let topIDs = ids

      if (kind) {
        name = INGREDIENT_KINDS.find(({ value }) => value === kind)?.label
        const kindIngredients = KIND_INGREDIENT_DICT[kind] ?? []
        topIDs.push(...uniq(rejectNil(kindIngredients.map(({ id }) => id))))
        if (name?.startsWith('Syrup')) console.log(topIDs)
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
        .filter(
          (id) =>
            (ingredientDict[id]?.stock ??
              baseIngredientDict[id]?.stock ??
              -1) >= 0
        )

      const excludeSet = new Set(stockedIDs)
      const root = createTree(items, excludeSet)
      topIDs = topIDs.filter((id) => !excludeSet.has(id))

      const stocked = stockedIDs
        // Remove any that have already been added in previous categories
        .filter((id) => allStocked.has(id))
        .map((id) => ingredientDict[id] ?? baseIngredientDict[id])
      stockedIDs.forEach((id) => {
        allStocked.delete(id)
      })

      const topItems = topIDs.map((id) => {
        const def = ingredientDict[id] ?? baseIngredientDict[id] ?? {}
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
  const data = await getData()
  const { baseIngredientDict, ingredientDict } = data

  const ingredients = new Set<string>(getStocked(baseIngredientDict))
  const spirits = new Set<string>(getStocked(ingredientDict))

  const toCategory = createCategoryParser(data)

  const spiritCategories = spiritSections.map(toCategory(spirits))
  const ingredientCategories = ingredientSections.map(toCategory(ingredients))

  spiritCategories.push({
    stocked: Array.from(spirits).map((id) => ingredientDict[id]),
    name: 'Other Spirits',
  })

  return (
    <DataProvider {...data}>
      <Container className="relative py-8">
        <section className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <H2>Spirits</H2>
            <div
              className={cn(
                'grid gap-x-4 gap-y-4 lg:gap-x-6 lg:gap-y-8',
                'grid-cols-[repeat(auto-fill,minmax(theme(spacing.64),1fr))]',
                'grid-rows-['
              )}
            >
              {spiritCategories.map((c, i) => (
                <Category key={c.name ?? i} category={c} muteItems />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <H2>Ingredients</H2>
            <div
              className={cn(
                'grid gap-x-4 gap-y-4 lg:gap-x-6 lg:gap-y-8',
                'grid-cols-[repeat(auto-fill,minmax(theme(spacing.64),1fr))]',
                'grid-rows-['
              )}
            >
              {ingredientCategories.map((c, i) => (
                <Category key={c.name ?? i} category={c} />
              ))}
            </div>
          </div>
        </section>
      </Container>
    </DataProvider>
  )
}
