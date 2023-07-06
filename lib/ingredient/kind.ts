export const INGREDIENT_KINDS = [
  { value: 'spirit', label: 'Spirits' },
  { value: 'bitters', label: 'Bitters, Shrubs & Extracts' },
  { value: 'juice', label: 'Juice & Coffee' },
  { value: 'syrup', label: 'Syrup, Sugar & Muddled' },
  { value: 'soda', label: 'Soda, Wine & Beer' },
  { value: 'dairy', label: 'Eggs, Milk & Cream' },
  { value: 'garnish', label: 'Garnish' },
] as const

export type IngredientKind = (typeof INGREDIENT_KINDS)[number]['value']
