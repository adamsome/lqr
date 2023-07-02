import { Ingredient } from '@/lib/types'

export function createIngredientParser(
  baseIngredients: Ingredient[],
  userIngredientDict: Record<string, Partial<Ingredient>>
) {
  const baseIngredientDict = baseIngredients.reduce<Record<string, Ingredient>>(
    (acc, it) => {
      const { id } = it
      const userIngredient = userIngredientDict[id] ?? {}
      acc[id] = { ...it, ...userIngredient }
      return acc
    },
    {}
  )
  function parseIngredient(def: Ingredient) {
    const { id } = def
    const userIngredient = userIngredientDict[id] ?? {}
    const ingredient: Ingredient = { ...def, ...userIngredient }
    return ingredient
  }
  return [baseIngredientDict, parseIngredient] as const
}

export function parseIngredients(
  baseIngredients: Ingredient[],
  userIngredients: Record<string, Partial<Ingredient>>,
  ingredientDefs: Ingredient[]
) {
  const [baseIngredientDict, parseIngredient] = createIngredientParser(
    baseIngredients,
    userIngredients
  )

  const { ingredientDict, ingredientIDs } = ingredientDefs.reduce(
    (acc, def) => {
      const ingredient = parseIngredient(def)
      acc.ingredientDict[def.id] = ingredient
      acc.ingredientIDs.push(def.id)
      return acc
    },
    {
      ingredientDict: {} as Record<string, Ingredient>,
      ingredientIDs: [] as string[],
    }
  )

  return {
    baseIngredientDict,
    ingredientDict,
    ingredientIDs,
  }
}
