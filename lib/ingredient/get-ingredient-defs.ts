import { curry } from 'ramda'

import { CATEGORY_DICT, CategoryDef } from '@/lib/generated-consts'
import { IngredientDef } from '@/lib/types'

export type DefPath = [CategoryDef, ...IngredientDef[]]

export const getIngredientDefs = curry(
  (
    baseIngredientDict: Record<string, IngredientDef>,
    id: string
  ): DefPath | undefined => {
    const defs: IngredientDef[] = []
    let def: IngredientDef | undefined = baseIngredientDict[id]
    if (!def) {
      return undefined
    }
    const categoryID = def.category
    const category = CATEGORY_DICT[categoryID]
    while (def) {
      defs.push(def)
      def = def.parent ? baseIngredientDict[def.parent] : undefined
    }
    defs.reverse()
    return [category, ...defs]
  }
)
