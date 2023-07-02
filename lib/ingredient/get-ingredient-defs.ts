import { curry } from 'ramda'

import { CATEGORY_DICT, CategoryDef } from '@/lib/generated-consts'
import { Ingredient } from '@/lib/types'

export type DefPath = [CategoryDef, ...Ingredient[]]

export const getIngredientDefs = curry(
  (
    baseIngredientDict: Record<string, Ingredient>,
    id: string
  ): DefPath | undefined => {
    const defs: Ingredient[] = []
    let def: Ingredient | undefined = baseIngredientDict[id]
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
