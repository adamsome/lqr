import { CATEGORY_DICT, Category } from '@/lib/consts'
import { IngredientDef } from '@/lib/types'

export const getIngredientName =
  (baseIngredientDict: Record<string, IngredientDef>) =>
  (path: string[], { full }: { full?: boolean } = {}) => {
    if (full) {
      if (path.length > 1) {
        return baseIngredientDict[path[path.length - 1]].name
      }
      if (path.length === 0) {
        return CATEGORY_DICT[path[0] as Category].name
      }
      return ''
    }

    const [category, ...ids] = path
    let categoryPrefix = CATEGORY_DICT[category as Category].name
    if (ids.length) categoryPrefix += ', '
    const ancestorNames = ids
      .map((id) => baseIngredientDict[id].name)
      .join(', ')
    return categoryPrefix + ancestorNames
  }
