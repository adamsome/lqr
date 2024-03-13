export const SEARCH_KEY = 'q'
export const CATEGORY_KEY = 'cat'
export const USER_KEY = 'u'
export const INGREDIENT_KEY = 'it'
export const BAR_CATEGORY_KEY = 'c'
export const SORT_KEY = 'sort'
export const SORT_DESC_KEY = 'desc'
export const LIMIT_KEY = 'limit'

export const DEFAULT_LIMIT = 50

export const SORT_VALUES = [
  'stock',
  'name',
  'updated',
  'created',
  'year',
  'category',
  'user',
] as const

export type SpecSort = (typeof SORT_VALUES)[number]

const SORT_DICT: Record<SpecSort, string> = {
  stock: 'In Stock',
  name: 'Name',
  updated: 'Updated',
  created: 'Added',
  year: 'Year',
  category: 'Category',
  user: 'User',
}

const IS_SORT_DESC_BY_VALUE: Record<SpecSort, boolean> = {
  stock: true,
  name: false,
  updated: true,
  created: true,
  year: true,
  category: false,
  user: false,
}

export function getSpecSortLabel(value?: SpecSort): string {
  if (!value) return SORT_DICT[SORT_VALUES[0]]
  return SORT_DICT[value]
}

export function getSpecSortItems() {
  return SORT_VALUES.map((value) => ({ value, label: SORT_DICT[value] }))
}

export function isSpecSortDefaultDesc(value: SpecSort): boolean {
  return IS_SORT_DESC_BY_VALUE[value]
}
