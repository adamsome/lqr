import {
  CATEGORY_KEY,
  INGREDIENT_KEY,
  SEARCH_KEY,
  USER_KEY,
} from '@/app/specs/consts'
import { parseIngredientParam } from '@/app/specs/ingredient-param'
import {
  filterIngredientItems,
  testIngredientMethods,
} from '@/lib/ingredient/filter-ingredient-items'
import { IngredientData, Spec, SpecIngredient } from '@/lib/types'
import { asArray, head, rejectNil } from '@/lib/utils'

type FilterParams = {
  search: string
  categories: string[]
  users: string[]
  ingredients: SpecIngredient[]
}

export function filterSpecs(
  data: IngredientData,
  specs: Spec[],
  { search, categories, users, ingredients }: FilterParams,
): Spec[] {
  let result = specs
  if (search) {
    const words = search.toLowerCase().split(' ')
    result = result.filter((s) => {
      const name = s.name.toLowerCase()
      return words.some((w) => name.includes(w))
    })
  }
  if (categories.length) {
    result = result.filter((s) => categories.includes(s.category))
  }
  if (users.length) {
    result = result.filter((u) => users.includes(u.username))
  }
  if (ingredients.length) {
    const filterItems = filterIngredientItems(data)
    const idsPerIngredient = ingredients.map((it) =>
      data.dict[it.id ?? '']?.ordinal
        ? // If specific bottle ingredient (i.e. has ordinal), only match it
          [it.id]
        : // Match against all descendent ingredients and bottles
          filterItems({ include: [it] }).map(({ id }) => id),
    )
    result = result.filter((s) =>
      // Spec must match every ingredient filter item
      idsPerIngredient.every((ids, i) =>
        // Within filter item + descendents, one must match a spec ingredient
        ids.some((id) =>
          s.ingredients.some(
            (it) =>
              it.bottleID === id ||
              // If filter item is not a specific bottle, test modifiers too
              (it.id === id && testIngredientMethods(ingredients[i], it)),
          ),
        ),
      ),
    )
  }
  return result
}

type SearchParams = {
  [key: string]: string | string[] | undefined
}

export function parseFilterParams(searchParams: SearchParams): FilterParams {
  return {
    search: head(searchParams[SEARCH_KEY]) ?? '',
    categories: asArray(searchParams[CATEGORY_KEY] ?? []),
    users: asArray(searchParams[USER_KEY] ?? []),
    ingredients: rejectNil(
      asArray(searchParams[INGREDIENT_KEY] ?? []).map(parseIngredientParam),
    ),
  }
}
