import { Ingredient } from '@/lib/types'
import { curry } from 'ramda'

export const getIngredientPath = curry(
  (byID: Record<string, Ingredient>, id: string): string[] => {
    const path: string[] = []
    let node: Ingredient | undefined = byID[id]
    const category = node?.category
    while (node) {
      path.push(node.id)
      node = node.parent ? byID[node.parent] : undefined
    }
    if (category) path.push(category)
    path.reverse()
    return path
  }
)
