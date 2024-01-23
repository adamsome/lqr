import { Ingredient } from '@/app/lib/types'
import { curry } from 'ramda'

export const getIngredientPath = curry(
  (dict: Record<string, Ingredient>, id: string): string[] => {
    const path: string[] = []
    let node: Ingredient | undefined = dict[id]
    const category = node?.category
    while (node) {
      path.push(node.id)
      node = node.parent ? dict[node.parent] : undefined
    }
    if (category) path.push(category)
    path.reverse()
    return path
  },
)
