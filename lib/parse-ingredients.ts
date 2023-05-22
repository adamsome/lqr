import { Ingredient, IngredientDef } from '@/lib/types'

export function createIngredientParser(
  baseIngredients: IngredientDef[],
  userIngredientDict: Record<string, Partial<IngredientDef>>
) {
  const baseIngredientDict = baseIngredients.reduce<
    Record<string, IngredientDef>
  >((acc, it) => {
    acc[it.id] = it
    return acc
  }, {})
  function parseIngredient(def: IngredientDef) {
    const { id } = def
    const userIngredient = userIngredientDict[id] ?? {}
    const ancestors: IngredientDef[] = []
    let parentID = def.parent
    while (parentID) {
      const parentDef = baseIngredientDict[parentID]
      if (!parentDef) {
        throw Error(
          `No parent definition for '${parentID}' for ingredient '${def.name}'.`
        )
      }
      ancestors.push(parentDef)
      parentID = parentDef.parent
    }
    ancestors.reverse()
    const ingredient: Ingredient = { ...def, ...userIngredient, ancestors }
    return ingredient
  }
  return [baseIngredientDict, parseIngredient] as const
}
