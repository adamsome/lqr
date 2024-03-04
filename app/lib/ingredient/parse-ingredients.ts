import { Ingredient } from '@/app/lib/types'

export function createIngredientParser(
  baseIngredients: Ingredient[],
  userIngredientDict: Record<string, Partial<Ingredient>>,
) {
  const baseIngredientDict = baseIngredients.reduce<Record<string, Ingredient>>(
    (acc, it) => {
      const { id } = it
      const userIngredient = userIngredientDict[id] ?? {}
      acc[id] = { ...it, ...userIngredient }
      return acc
    },
    {},
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
  ingredientDefs: Ingredient[],
) {
  const [dict, parseIngredient] = createIngredientParser(
    baseIngredients,
    userIngredients,
  )

  const parsedDict = ingredientDefs.reduce((acc, def) => {
    acc[def.id] = parseIngredient(def)
    return acc
  }, dict)

  return parsedDict
}
