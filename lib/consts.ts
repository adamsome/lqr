// Auto-generated: Do not modify.

type HasName = {
  name: string
}

type CategoryDef = HasName & {
  type?: 'spirit' | 'beerWine' | 'bitters'
}

export type Category =
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
  | 'brandy'
  | 'cane'
  | 'fortifiedwine'
  | 'grain'
  | 'liqueur'
  | 'wine'

export const CATEGORY_DICT: Record<Category, CategoryDef> = {
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
  agave: { name: 'Agave', type: 'spirit' },
  beer: { name: 'Beer', type: 'beerWine' },
  bitters: { name: 'Bitters', type: 'bitters' },
  brandy: { name: 'Brandy', type: 'spirit' },
  cane: { name: 'Cane', type: 'spirit' },
  fortifiedwine: { name: 'Fortified wine', type: 'spirit' },
  grain: { name: 'Grain', type: 'spirit' },
  liqueur: { name: 'Liqueur', type: 'spirit' },
  wine: { name: 'Wine', type: 'beerWine' },
}

export type ProductionMethod = 'column' | 'pot' | 'blended' | 'coffey'

export const PRODUCTION_METHOD_DICT: Record<ProductionMethod, HasName> = {
  column: { name: 'Column Still' },
  pot: { name: 'Pot Still' },
  blended: { name: 'Blended' },
  coffey: { name: 'Coffey Still' },
}

export type Aging = 'none' | 'light' | 'medium' | 'long'

export const AGING_DICT: Record<Aging, HasName> = {
  none: { name: 'Unaged' },
  light: { name: 'Lightly Aged' },
  medium: { name: 'Aged' },
  long: { name: 'Long Aged' },
}
