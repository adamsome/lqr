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
import { getData } from '@/lib/model/data'
import { Ingredient, IngredientDef } from '@/lib/types'
import { cn } from '@/lib/utils'

type Section = Partial<Omit<BarCategory, 'ingredients'>>

const sections: Section[] = [
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
    items: [
      { id: 'green_chartreuse', path: ['liqueur', 'liqueur_herbal'] },
      { id: 'yellow_chartreuse', path: ['liqueur', 'liqueur_herbal'] },
    ],
  },
  {
    name: 'Benedictine',
    items: [{ id: 'benedictine', path: ['liqueur', 'liqueur_herbal'] }],
  },
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
    items: [
      {
        id: 'john_d_taylors_velvet_falernum',
        path: ['liqueur', 'liqueur_herbal'],
      },
    ],
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
    items: [
      { id: 'st_elizabeth_allspice_dram', path: ['liqueur', 'liqueur_herbal'] },
    ],
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

function getStocked(
  dict: Record<string, IngredientDef | Ingredient>
): string[] {
  return Object.keys(dict).filter((id) => (dict[id].stock ?? -1) >= 0)
}

function createTree(items: IngredientItem[]): HierarchicalFilter {
  const root: HierarchicalFilter = {
    id: 'all',
    checked: false,
    childIDs: [],
    children: {},
  }
  for (const { id: bottleID, path } of items) {
    let node = root
    for (const id of path) {
      if (!node.children[id]) {
        node.childIDs.push(id)
        node.children[id] = { id, checked: false, childIDs: [], children: {} }
      }
      node = node.children[id]
    }
    if (!node.bottleIDs) node.bottleIDs = []
    node.bottleIDs.push(bottleID)
  }
  return root
}

export default async function Page() {
  const data = await getData()
  const { baseIngredientDict, ingredientDict } = data
  const getItems = filterIngredientItems(data)
  const getName = getIngredientName(baseIngredientDict, ingredientDict)

  const stockedIngredients = new Set<string>(getStocked(baseIngredientDict))
  const stockedSpirits = new Set<string>(getStocked(ingredientDict))

  const categories: BarCategory[] = sections.map((section) => {
    const { include, exclude, items: itemsProp, excludeIDs } = section
    const exclIDs = new Set(excludeIDs ?? [])
    const allItems = itemsProp ?? getItems({ include, exclude }) ?? []
    const items = allItems.filter((it) => !exclIDs.has(it.id))
    const root = createTree(items)
    const stockedItems = items.filter(
      ({ id }) => (ingredientDict[id]?.stock ?? -1) >= 0
    )
    stockedItems.forEach(({ id }) => {
      stockedSpirits.delete(id)
      stockedIngredients.delete(id)
    })
    const stocked = stockedItems.map(({ id }) => ingredientDict[id])
    const name =
      section.name ?? getName(include?.[0] ?? {}, { inclCategory: true })
    return { ...section, stocked, root, name }
  })

  categories.push({
    stocked: Array.from(stockedSpirits).map((id) => ingredientDict[id]),
    name: 'Other Spirits',
  })
  categories.push({
    stocked: Array.from(stockedIngredients).map((id) => baseIngredientDict[id]),
    name: 'Other Ingredients',
  })

  return (
    <DataProvider {...data}>
      <Container className="relative py-8">
        <section className="flex flex-col gap-4">
          <H2>Spirits</H2>
          <div
            className={cn(
              'grid gap-x-4 gap-y-4 lg:gap-x-6 lg:gap-y-8',
              'grid-cols-[repeat(auto-fill,minmax(theme(spacing.64),1fr))]',
              'grid-rows-['
            )}
          >
            {categories.map((c, i) => (
              <Category key={c.name ?? i} category={c} />
            ))}
          </div>
        </section>
      </Container>
    </DataProvider>
  )
}
