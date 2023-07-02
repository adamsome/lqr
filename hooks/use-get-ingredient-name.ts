import { useCallback, useMemo } from 'react'

import { useData } from '@/components/data-provider'
import { getIngredientName } from '@/lib/ingredient/get-ingredient-name'
import { Ingredient, SpecIngredient } from '@/lib/types'

export function useGetIngredientName() {
  const { baseIngredientDict, ingredientDict } = useData()

  const _getIngredientName = useMemo(
    () => getIngredientName(baseIngredientDict, ingredientDict),
    [baseIngredientDict, ingredientDict]
  )

  return useCallback(
    (
      ingredient: SpecIngredient | Ingredient,
      options?: { inclBottle?: boolean }
    ) => _getIngredientName(ingredient, options),
    [_getIngredientName]
  )
}
