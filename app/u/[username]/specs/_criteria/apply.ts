import {
  filterIngredientItems,
  testIngredientMethods,
} from '@/app/lib/ingredient/filter-ingredient-items'
import { IngredientData, Spec } from '@/app/lib/types'
import { sortSpecs } from './sort'
import { Criteria, SpecApplied } from './types'
import { partitionExclude } from './exclude'
import { rejectNil } from '@/app/lib/utils'

export function applyCriteria(
  data: IngredientData,
  specs: Spec[],
  criteria: Criteria,
): SpecApplied[] {
  let result = specs

  const { search, categories, users, ingredients, barCategories } = criteria

  if (search) {
    const words = search.toLowerCase().split(' ')
    result = result.filter((s) => {
      const name = s.name.toLowerCase()
      return words.some((w) => name.includes(w))
    })
  }
  if (categories.length) {
    result = result.filter((s) => categories.includes(s.category ?? '__na'))
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

  if (barCategories.length) {
    const { include, exclude } = partitionExclude(barCategories)
    result = rejectNil(
      result.map((s): SpecApplied | null => {
        let barCategoryCount = 0
        for (const it of s.ingredients) {
          const defID = it.bottleID ?? it.id
          if (!defID) continue
          const keys = data.dict[defID]?.categoryKeys
          if (!keys?.category) {
            console.warn(`No filter category for '${defID}' in ${s.id}`)
            continue
          }
          if (exclude.has(keys.category)) return null
          if (include.has(keys.category)) barCategoryCount++
        }
        if (barCategoryCount > 0) {
          return { ...s, barCategoryCount }
        }
        return include.size === 0 ? s : null
      }),
    )
  }

  return sortSpecs(result, criteria)
}
