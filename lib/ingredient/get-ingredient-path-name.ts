import { curry } from 'ramda'

import { CATEGORY_DICT, Category } from '@/lib/generated-consts'
import { Ingredient } from '@/lib/types'

export const getIngredientPathName = curry(
  (dict: Record<string, Ingredient>, path: string[]) => {
    const [category, ...ids] = path
    let categoryPrefix = CATEGORY_DICT[category as Category].name
    if (ids.length) categoryPrefix += ', '
    const ancestorNames = ids.map((id) => dict[id].name).join(', ')
    return categoryPrefix + ancestorNames
  }
)
