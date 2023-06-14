export const INGREDIENT_KINDS = [
  { value: 'spirit', label: 'Spirits' },
  { value: 'bitters', label: 'Bitters' },
  { value: 'syrup', label: 'Syrup, Sugar & Muddled' },
  { value: 'juice', label: 'Juice & Coffee' },
  { value: 'soda', label: 'Soda, Wine & Beer' },
  { value: 'dairy', label: 'Eggs, Milk & Cream' },
  { value: 'garnish', label: 'Garnish' },
] as const

export type IngredientKind = (typeof INGREDIENT_KINDS)[number]['value']
