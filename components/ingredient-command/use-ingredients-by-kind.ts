import { useMemo } from 'react'

import { useData } from '@/components/data-provider'
import { HierarchicalFilter } from '@/lib/hierarchical-filter'
import { IngredientKind } from '@/lib/ingredient/kind'
import { IngredientDef, SpecIngredient } from '@/lib/types'
import { rejectNil } from '@/lib/utils'

const kindIngredientDict: Record<IngredientKind, SpecIngredient[]> = {
  spirit: [
    { id: 'grain_gin_londondry' },
    { id: 'grain_whiskey_rye' },
    { id: 'fortifiedwine_sweetvermouth' },
    { id: 'fortifiedwine_dryvermouth' },
    { id: 'agave_mezcal' },
    { id: 'agave_tequila_blanco' },
    { id: 'cane_rum' },
    { id: 'liqueur_absinthe' },
    { id: 'liqueur_maraschino' },
    { id: 'liqueur_orange' },
    { id: 'liqueur_amaro_aperitivo', bottleID: 'campari' },
    { id: 'liqueur_amaro_carciofo', bottleID: 'cynar' },
    { id: 'grain_whiskey_bourbon' },
    { id: 'grain_whiskey_scotch_blended' },
    { id: 'grain_whiskey_scotch_islay' },
    { id: 'brandy_grape_cognac' },
    { id: 'brandy_apple' },
    // TODO: All spirit categories
    // TODO: Rum selector
  ],
  bitters: [
    { id: 'bitters_aromatic', bottleID: 'angostura' },
    { id: 'bitters_creole', bottleID: 'peychauds' },
    { id: 'bitters_orange' },
  ],
  syrup: [
    { id: 'syrup_simple' },
    { id: 'syrup_demerara' },
    { id: 'syrup_honey' },
    { id: 'syrup_grenadine' },
    { id: 'syrup_maple' },
    { id: 'syrup_orgeat' },
    { id: 'syrup_cinnamon' },
    { id: 'syrup_agave' },
    { id: 'cream_coconut' },
    { id: 'sugar_demerara', usage: 'muddled' },
    { id: 'sugar_brown', usage: 'muddled' },
    { id: 'sugar_white', usage: 'muddled' },
    { id: 'spice_mint', usage: 'muddled' },
    { id: 'spice_ginger', usage: 'muddled' },
  ],
  juice: [
    { id: 'juice_lemon' },
    { id: 'juice_lime' },
    { id: 'juice_grapefruit' },
    { id: 'juice_orange' },
    { id: 'juice_pineapple' },
    { id: 'coffee_hot' },
    { id: 'coffee_coldbrew' },
  ],
  soda: [
    { id: 'soda_club' },
    { id: 'wine_sparkling' },
    { id: 'soda_tonic' },
    { id: 'soda_gingerbeer' },
    { id: 'soda_ginger' },
    { id: 'soda_grapefruit' },
    { id: 'soda_guava' },
    { id: 'fortifiedwine_sherry_oloroso' },
    { id: 'fortifiedwine_sherry_palecream' },
    { id: 'fortifiedwine_sherry_pedroximenez' },
    { id: 'fortifiedwine_sherry' },
    { id: 'beer_pilsner' },
    { id: 'beer_ipa' },
    { id: 'beer_grapefruit' },
    { id: 'beer_gose' },
    { id: 'wine_red' },
    { id: 'wine_red_lambrusco' },
    { id: 'wine_red_malbec' },
    { id: 'wine_red_rancio' },
    { id: 'wine_red_syrah' },
    { id: 'wine_sake_sparkling' },
    { id: 'wine_sweet' },
    { id: 'wine_sweet_moscatel' },
    { id: 'wine_sweet_sauternes' },
    { id: 'wine_white_riesling' },
  ],
  dairy: [
    { id: 'egg_white' },
    { id: 'egg_yolk' },
    { id: 'egg_whole' },
    { id: 'cream_heavy' },
    { id: 'milk_whole' },
    { id: 'milk_condensed' },
    { id: 'cream_coconut' },
    { id: 'milk_coconut' },
    { id: 'water_coconut' },
    { id: 'egg_aquafaba' },
  ],
  garnish: [
    { id: 'fruit_lemon', usage: 'twist' },
    { id: 'fruit_orange', usage: 'twist' },
    { id: 'fruit_grapefruit', usage: 'twist' },
    { id: 'fruit_olive', usage: 'whole' },
    { id: 'fruit_cherry', usage: 'whole' },
    { id: 'spice_mint', usage: 'whole' },
    { id: 'spice_salt', usage: 'rim' },
    { id: 'sugar_white', usage: 'rim' },
    { id: 'spice_nutmeg', usage: 'grated' },
    { id: 'spice_cinnamon', usage: 'grated' },
    { id: 'spice_ginger', usage: 'grated' },
    { id: 'spice_cloves', usage: 'grated' },
  ],
}

const kindMoreIngredientTypes: [IngredientKind, Partial<IngredientDef>[]][] = [
  [
    'bitters',
    [
      { category: 'bitters' },
      { category: 'acid' },
      { category: 'extract' },
      { category: 'shrub' },
    ],
  ],
  ['syrup', [{ category: 'syrup' }]],
  [
    'juice',
    [
      { category: 'juice' },
      { category: 'brine' },
      { category: 'cordial' },
      { category: 'jelly' },
      { category: 'puree' },
      { category: 'tea' },
      { category: 'water' },
    ],
  ],
  ['soda', [{ category: 'cider' }]],
  ['dairy', [{ category: 'cream' }, { category: 'oil' }]],
  [
    'garnish',
    [
      { category: 'chocolate' },
      { id: 'coffee_bean' },
      { category: 'cheese' },
      { category: 'leaf' },
      { category: 'flower' },
      { category: 'fruit' },
      { category: 'nut' },
      { category: 'spice' },
      { category: 'vegetable' },
    ],
  ],
]

function appendKindMoreIngredients(
  categoryFilter: HierarchicalFilter
): Record<IngredientKind, SpecIngredient[]> {
  return kindMoreIngredientTypes.reduce(
    (acc, [kind, defs]) => {
      const ingredients = acc[kind]
      const idSet = new Set(rejectNil(ingredients.map((it) => it.id)))
      const moreIngredients = defs.flatMap(({ id, category }) => {
        const ids = categoryFilter.children[category ?? '']?.childIDs ?? []
        if (id) ids.push(id)
        return ids
          .filter((id) => !idSet.has(id))
          .map((id): SpecIngredient => ({ id }))
      })
      return { ...acc, [kind]: [...ingredients, {}, ...moreIngredients] }
    },
    { ...kindIngredientDict }
  )
}

export function useIngredientsByKind() {
  const { categoryFilter } = useData()
  return useMemo(
    () => appendKindMoreIngredients(categoryFilter),
    [categoryFilter]
  )
}
