import { IngredientDataProvider } from '@/app/components/data-provider'
import { getIngredientData } from '@/app/lib/model/ingredient-data'
import { Box as CategoryBox } from '@/app/u/[username]/bar/[cabinet]/[shelf]/[category]/box'
import { Box as ShelfBox } from '@/app/u/[username]/bar/[cabinet]/[shelf]/box'
import { createCategoryBuilder } from '@/app/u/[username]/bar/lib/category-builder'
import { SAMPLE_DEFS } from '@/app/u/[username]/bar/lib/defs'
import {
  BarCategory,
  CabinetDef,
  ShelfDef,
} from '@/app/u/[username]/bar/lib/types'
import { SAMPLE_SPECS_PATH } from './lib/ingredient/samples'

export async function SampleBar() {
  const { dict, tree } = await getIngredientData()
  const inStock: Record<string, string[]> = {
    'rye-whiskey': ['rittenhouse', 'pikesville'],
    'dry-vermouth': ['dolin_dry'],
    maraschino: ['liqueur_maraschino'],
    angostura: ['angostura'],
    campari: ['campari'],
  }

  const { build } = createCategoryBuilder({ tree, dict })

  const cabinetKeys = { cabinet: 'essentials' }
  let cabinet = SAMPLE_DEFS[cabinetKeys.cabinet] as CabinetDef
  cabinet = { ...cabinet, keys: cabinetKeys }
  const shelfKeys = { ...cabinetKeys, shelf: 'core-spirits' }
  let shelfDef = cabinet.children[shelfKeys.shelf] as ShelfDef
  shelfDef = { ...shelfDef, keys: shelfKeys }

  return (
    <IngredientDataProvider dict={dict} tree={tree}>
      <ShelfBox key={shelfDef.name} def={shelfDef} hideHeading>
        {shelfDef.gridIDs.map((category) => {
          const keys = { ...shelfKeys, category }
          const def = { ...shelfDef.children[category], keys }
          const ids = inStock[category] ?? []
          const stocked = ids.map((id) => ({ ...dict[id], stock: 1 }))
          const barCategory: BarCategory = { ...build(def), stocked }
          if (!barCategory) return null
          return (
            <CategoryBox
              key={category}
              def={def}
              category={barCategory}
              href={SAMPLE_SPECS_PATH}
            />
          )
        })}
      </ShelfBox>
    </IngredientDataProvider>
  )
}
