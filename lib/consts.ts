// Auto-generated: Do not modify.

import { HasName } from '@/lib/types'

export type IngredientCategory =
  | 'acid'
  | 'brine'
  | 'cheese'
  | 'chocolate'
  | 'cider'
  | 'coffee'
  | 'cordial'
  | 'cream'
  | 'egg'
  | 'extract'
  | 'flower'
  | 'fruit'
  | 'jelly'
  | 'juice'
  | 'leaf'
  | 'milk'
  | 'nut'
  | 'oil'
  | 'puree'
  | 'shrub'
  | 'soda'
  | 'spice'
  | 'sugar'
  | 'syrup'
  | 'tea'
  | 'vegetable'
  | 'water'
  | 'agave'
  | 'beer'
  | 'bitters'
  | 'cane'
  | 'fortifiedwine'
  | 'brandy'
  | 'grain'
  | 'liqueur'
  | 'wine'

export const IngredientCategoryDefs: Record<IngredientCategory, HasName> = {
  acid: { name: 'Acid' },
  brine: { name: 'Brine' },
  cheese: { name: 'Cheese' },
  chocolate: { name: 'Chocolate' },
  cider: { name: 'Cider' },
  coffee: { name: 'Coffee' },
  cordial: { name: 'Cordial' },
  cream: { name: 'Cream' },
  egg: { name: 'Egg' },
  extract: { name: 'Extract' },
  flower: { name: 'Flower' },
  fruit: { name: 'Fruit' },
  jelly: { name: 'Jelly' },
  juice: { name: 'Juice' },
  leaf: { name: 'Leaf' },
  milk: { name: 'Milk' },
  nut: { name: 'Nut' },
  oil: { name: 'Oil' },
  puree: { name: 'Purée' },
  shrub: { name: 'Shrub' },
  soda: { name: 'Soda' },
  spice: { name: 'Spice' },
  sugar: { name: 'Sugar' },
  syrup: { name: 'Syrup' },
  tea: { name: 'Tea' },
  vegetable: { name: 'Vegetable' },
  water: { name: 'Water' },
  agave: { name: 'Agave' },
  beer: { name: 'Beer' },
  bitters: { name: 'Bitters' },
  cane: { name: 'Cane' },
  fortifiedwine: { name: 'Fortified wine' },
  brandy: { name: 'Brandy' },
  grain: { name: 'Grain' },
  liqueur: { name: 'Liqueur' },
  wine: { name: 'Wine' },
}

export type ProductionMethod = 'column' | 'pot' | 'blended' | 'coffey'

export const ProductionMethodDefs: Record<ProductionMethod, HasName> = {
  column: { name: 'Column Still' },
  pot: { name: 'Pot Still' },
  blended: { name: 'Blended' },
  coffey: { name: 'Coffey Still' },
}

export type Aging = 'none' | 'light' | 'medium' | 'long'

export const AgingDefs: Record<Aging, HasName> = {
  none: { name: 'Unaged' },
  light: { name: 'Lightly Aged' },
  medium: { name: 'Aged' },
  long: { name: 'Long Aged' },
}
