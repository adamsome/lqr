// Auto-generated: Do not modify.

type HasName = {
  name: string
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

export type CategoryDef = HasName & {
  id: Category
  type?: 'spirit' | 'beerWine' | 'bitters'
}

export const CATEGORY_DICT: Record<Category, CategoryDef> = {
  acid: { id: 'acid', name: 'Acid' },
  brine: { id: 'brine', name: 'Brine' },
  cheese: { id: 'cheese', name: 'Cheese' },
  chocolate: { id: 'chocolate', name: 'Chocolate' },
  cider: { id: 'cider', name: 'Cider' },
  coffee: { id: 'coffee', name: 'Coffee' },
  cordial: { id: 'cordial', name: 'Cordial' },
  cream: { id: 'cream', name: 'Cream' },
  egg: { id: 'egg', name: 'Egg' },
  extract: { id: 'extract', name: 'Extract' },
  flower: { id: 'flower', name: 'Flower' },
  fruit: { id: 'fruit', name: 'Fruit' },
  jelly: { id: 'jelly', name: 'Jelly' },
  juice: { id: 'juice', name: 'Juice' },
  leaf: { id: 'leaf', name: 'Leaf' },
  milk: { id: 'milk', name: 'Milk' },
  nut: { id: 'nut', name: 'Nut' },
  oil: { id: 'oil', name: 'Oil' },
  puree: { id: 'puree', name: 'Purée' },
  shrub: { id: 'shrub', name: 'Shrub' },
  soda: { id: 'soda', name: 'Soda' },
  spice: { id: 'spice', name: 'Spice' },
  sugar: { id: 'sugar', name: 'Sugar' },
  syrup: { id: 'syrup', name: 'Syrup' },
  tea: { id: 'tea', name: 'Tea' },
  vegetable: { id: 'vegetable', name: 'Vegetable' },
  water: { id: 'water', name: 'Water' },
  agave: { id: 'agave', name: 'Agave', type: 'spirit' },
  beer: { id: 'beer', name: 'Beer', type: 'beerWine' },
  bitters: { id: 'bitters', name: 'Bitters', type: 'bitters' },
  brandy: { id: 'brandy', name: 'Brandy', type: 'spirit' },
  cane: { id: 'cane', name: 'Cane', type: 'spirit' },
  fortifiedwine: { id: 'fortifiedwine', name: 'Fortified wine', type: 'spirit' },
  grain: { id: 'grain', name: 'Grain', type: 'spirit' },
  liqueur: { id: 'liqueur', name: 'Liqueur', type: 'spirit' },
  wine: { id: 'wine', name: 'Wine', type: 'beerWine' },
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
