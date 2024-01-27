import { IngredientDataProvider } from '@/app/components/data-provider'
import { Stack } from '@/app/components/layout/stack'
import { HorizontalScroller } from '@/app/components/ui/horizontal-scroller'
import { UserAvatar } from '@/app/components/user/user-avatar'
import { getIngredientData } from '@/app/lib/model/ingredient-data'
import { Spec, User } from '@/app/lib/types'
import { SpecStockText } from '@/app/u/[username]/specs/[id]/spec-stock'
import { Card, CardDescription } from '@/app/u/[username]/specs/card'

const specs = [
  {
    id: 'old_pal',
    name: 'Old Pal',
    year: 1922,
    ingredients: [
      {
        quantity: 2,
        unit: 'oz',
        bottleID: 'old_overholt',
        id: 'grain_whiskey_rye',
      },
      {
        quantity: 0.75,
        unit: 'oz',
        bottleID: 'dolin_dry',
        id: 'fortifiedwine_dryvermouth',
      },
      {
        quantity: 0.75,
        unit: 'oz',
        bottleID: 'campari',
        id: 'liqueur_amaro_aperitivo',
      },
    ],
    username: 'classics',
    userDisplayName: 'Classics',
    stock: { count: 3, total: 3, ingredients: [] },
  },
  {
    id: 'armistice',
    name: 'Armistice',
    year: 2000,
    ingredients: [
      {
        quantity: 1.5,
        unit: 'oz',
        bottleID: 'rittenhouse',
        id: 'grain_whiskey_rye',
      },
      {
        quantity: 0.5,
        unit: 'oz',
        bottleID: 'noilly_prat_extra_dry',
        id: 'fortifiedwine_dryvermouth',
      },
      {
        quantity: 0.25,
        unit: 'oz',
        bottleID: 'green_chartreuse',
        id: 'liqueur_herbal',
      },
      {
        quantity: 0.25,
        unit: 'oz',
        bottleID: 'luxardo_maraschino_liqueur',
        id: 'liqueur_maraschino',
      },
      { quantity: 2, unit: 'dash', id: 'bitters_aromatic' },
    ],
    username: 'classics',
    userDisplayName: 'Classics',
    stock: { count: 4, total: 5, ingredients: [] },
  },
  {
    id: 'campari-collins',
    name: 'Campari Collins',
    year: 2022,
    ingredients: [
      { id: 'spice_salt', quantity: 3, unit: 'dash' },
      { id: 'syrup_simple', quantity: 0.75, unit: 'oz' },
      { id: 'juice_lemon', quantity: 0.75, unit: 'oz' },
      {
        id: 'liqueur_amaro_aperitivo',
        bottleID: 'campari',
        quantity: 1.5,
        unit: 'oz',
      },
      { id: 'soda_club', quantity: 3, unit: 'oz', usage: 'top' },
      { id: 'fruit_orange', quantity: 1, usage: 'twist' },
    ],
    username: 'adamsome',
    stock: { count: 3, total: 3, ingredients: [] },
  },
  {
    id: 'old_fashioned',
    name: 'Old Fashioned',
    year: 1806,
    ingredients: [
      {
        quantity: 2,
        unit: 'oz',
        bottleID: 'wild_turkey',
        id: 'grain_whiskey_rye',
      },
      { quantity: 1, id: 'sugar_demerara' },
      {
        quantity: 2,
        unit: 'dash',
        bottleID: 'angostura',
        id: 'bitters_aromatic',
      },
      { quantity: 1, usage: 'twist', id: 'fruit_lemon' },
    ],
    username: 'classics',
    userDisplayName: 'Classics',
    stock: { count: 3, total: 3, ingredients: [] },
  },
] as unknown as Spec[]

const userDict = {
  adamsome: {
    username: 'adamsome',
    imageUrl:
      'https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18yUWFPSURDbnBQOG4wNzBsdTd4NTVoeU9uazYiLCJyaWQiOiJ1c2VyXzJRYVNkTGhwTDdkTWNtRDk5OVNLQjJ0ZUVJTSJ9',
  },
  classics: {
    username: 'classics',
    displayName: 'Classics',
    imageUrl: '/avatars/classic.jpg',
  },
} as unknown as Record<string, User>

const specCols = specs.reduce((acc, spec, i) => {
  if (!acc[Math.floor(i / 2)]) acc.push([])
  acc[Math.floor(i / 2)].push(spec)
  return acc
}, [] as Spec[][])

export async function SampleSpecs() {
  const data = await getIngredientData()
  return (
    <IngredientDataProvider {...data}>
      <div className="-mx-4">
        <HorizontalScroller className="px-4" countInView={[1, 1, 2]}>
          {specCols.map((col, i) => (
            <Stack key={i}>
              {col.map((spec) => (
                <Card
                  key={spec.id}
                  className="bg-primary/[0.15] border border-primary/7.5 shadow"
                  data={data}
                  spec={spec}
                  description={
                    <CardDescription>
                      <UserAvatar
                        className="overflow-hidden"
                        size="sm"
                        user={userDict[spec.username]}
                      />
                      {spec.stock && (
                        <SpecStockText className="text-xs" stock={spec.stock} />
                      )}
                    </CardDescription>
                  }
                />
              ))}
            </Stack>
          ))}
        </HorizontalScroller>
      </div>
    </IngredientDataProvider>
  )
}
