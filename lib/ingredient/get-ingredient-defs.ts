import { curry } from 'ramda'

import { CATEGORY_DICT, CategoryDef } from '@/lib/consts'
import { IngredientDef } from '@/lib/types'

export const getIngredientDefs = curry(
  (
    baseIngredientDict: Record<string, IngredientDef>,
    id: string
  ): [CategoryDef, ...IngredientDef[]] => {
    const defs: IngredientDef[] = []
    let def: IngredientDef | undefined = baseIngredientDict[id]
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
