import { Ingredient } from '@/lib/types'
import { curry } from 'ramda'

export const getIngredientPath = curry(
  (
    baseIngredientDict: Record<string, Ingredient>,
    ingredientDict: Record<string, Ingredient>,
    id: string
  ): string[] => {
    const path: string[] = []
    let node: Ingredient | undefined =
      ingredientDict[id] ?? baseIngredientDict[id]
    const category = node?.category
    while (node) {
      path.push(node.id)
      node = node.parent ? baseIngredientDict[node.parent] : undefined
    }
    if (category) path.push(category)
    path.reverse()
    return path
  }
)
