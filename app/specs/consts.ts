export const SEARCH_KEY = 'q'
export const CATEGORY_KEY = 'cat'
export const USER_KEY = 'u'
export const INGREDIENT_KEY = 'it'
export const SORT_KEY = 'sort'
export const SORT_DESC_KEY = 'desc'

export const SORT_VALUES = [
  'stock',
  'name',
  'category',
  'user',
  'created',
  'updated',
] as const

export type SpecSort = (typeof SORT_VALUES)[number]

const SORT_DICT: Record<SpecSort, string> = {
  stock: 'In Stock',
  name: 'Name',
  category: 'Category',
  user: 'User',
  created: 'Added',
  updated: 'Updated',
}

const IS_SORT_DESC_BY_VALUE: Record<SpecSort, boolean> = {
  stock: true,
  name: false,
  category: false,
  user: false,
  created: true,
  updated: true,
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
