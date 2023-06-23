import { BarCategory, Category } from '@/app/bar/category'
import { DataProvider } from '@/components/data-provider'
import { Container } from '@/components/ui/container'
import { H2 } from '@/components/ui/h2'
import {
  IngredientFilter,
  getIngredientBottleIDs,
} from '@/lib/ingredient/get-ingredient-bottle-ids'
import { getIngredientName } from '@/lib/ingredient/get-ingredient-name'
import { getData } from '@/lib/model/data'
import { Ingredient, IngredientDef } from '@/lib/types'
import { cn } from '@/lib/utils'

type Section = IngredientFilter &
  Partial<Omit<BarCategory, 'ingredients'>> & {
    bottleIDs?: string[]
    excludeBottleIDs?: string[]
  }

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
  { name: 'Chartreuse', bottleIDs: ['green_chartreuse', 'yellow_chartreuse'] },
  { name: 'Benedictine', bottleIDs: ['benedictine'] },
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
  { name: 'Falernum', bottleIDs: ['john_d_taylors_velvet_falernum'] },
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
  { name: 'Allspice Dram', bottleIDs: ['st_elizabeth_allspice_dram'] },
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
    excludeBottleIDs: [
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

export default async function Page() {
  const data = await getData()
  const { baseIngredientDict, ingredientDict } = data
  const getBottleIDs = getIngredientBottleIDs(data)
  const getName = getIngredientName(baseIngredientDict, ingredientDict)

  const stockedIngredients = new Set<string>(getStocked(baseIngredientDict))
  const stockedSpirits = new Set<string>(getStocked(ingredientDict))

  const categories: BarCategory[] = sections.map((section) => {
    const { include, exclude, bottleIDs, excludeBottleIDs, ...rest } = section
    const exclIDs = new Set(excludeBottleIDs ?? [])
    const ids =
      bottleIDs ??
      getBottleIDs({ include, exclude }).filter(
        (id) => (ingredientDict[id]?.stock ?? -1) >= 0 && !exclIDs.has(id)
      )
    ids.forEach((id) => {
      stockedSpirits.delete(id)
      stockedIngredients.delete(id)
    })
    const ingredients = ids.map((id) => ingredientDict[id])
    const name =
      rest.name ?? getName(include?.[0] ?? {}, { inclCategory: true })
    return { ...rest, ingredients, name }
  })
  categories.push({
    ingredients: Array.from(stockedSpirits).map((id) => ingredientDict[id]),
    name: 'Other Spirits',
  })
  categories.push({
    ingredients: Array.from(stockedIngredients).map(
      (id) => baseIngredientDict[id]
    ),
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
