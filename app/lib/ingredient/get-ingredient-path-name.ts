import { curry } from 'ramda'

import { CATEGORY_DICT, Category } from '@/app/lib/generated-consts'
import { Ingredient } from '@/app/lib/types'

export const getIngredientPathName = curry(
  (dict: Record<string, Ingredient>, path: string[]) => {
    const [category, ...ids] = path
    let categoryPrefix = CATEGORY_DICT[category as Category].name
    if (ids.length) categoryPrefix += ', '
    const ancestorNames = ids
      .map((id) => {
        const ingredient = dict[id]
        if (!ingredient) {
          console.error(
            `'getIngredientPathName': No ingredient found for path [${path.join(
              ',',
            )}]`,
          )
          return 'Unknown Ingredient'
        }
        return dict[id].name
      })
      .join(', ')
    return categoryPrefix + ancestorNames
  },
)
