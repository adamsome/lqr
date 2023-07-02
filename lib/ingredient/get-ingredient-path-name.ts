import { curry } from 'ramda'

import { CATEGORY_DICT, Category } from '@/lib/generated-consts'
import { IngredientDef } from '@/lib/types'

export const getIngredientPathName = curry(
  (baseIngredientDict: Record<string, IngredientDef>, path: string[]) => {
    const [category, ...ids] = path
    let categoryPrefix = CATEGORY_DICT[category as Category].name
    if (ids.length) categoryPrefix += ', '
    const ancestorNames = ids
      .map((id) => baseIngredientDict[id].name)
      .join(', ')
    return categoryPrefix + ancestorNames
  }
)
