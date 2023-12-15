import { Criteria } from '@/app/u/[username]/specs/_criteria/types'
import { sortSpecs } from '@/app/u/[username]/specs/_criteria/sort'
import {
  filterIngredientItems,
  testIngredientMethods,
} from '@/lib/ingredient/filter-ingredient-items'
import { IngredientData, Spec } from '@/lib/types'

export function applyCriteria(
  data: IngredientData,
  specs: Spec[],
  criteria: Criteria,
): Spec[] {
  let result = specs

  const { search, categories, users, ingredients } = criteria

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

  return sortSpecs(result, criteria)
}
