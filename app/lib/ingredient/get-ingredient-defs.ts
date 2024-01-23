import { curry } from 'ramda'

import { CATEGORY_DICT, CategoryDef } from '@/app/lib/generated-consts'
import { Ingredient } from '@/app/lib/types'

export type DefPath = [CategoryDef, ...Ingredient[]]

export const getIngredientDefs = curry(
  (dict: Record<string, Ingredient>, id: string): DefPath | undefined => {
    const defs: Ingredient[] = []
    let def: Ingredient | undefined = dict[id]
    if (!def) {
      return undefined
    }
    const categoryID = def.category
    const category = CATEGORY_DICT[categoryID]
    while (def) {
      defs.push(def)
      def = def.parent ? dict[def.parent] : undefined
    }
    defs.reverse()
    return [category, ...defs]
  },
)
