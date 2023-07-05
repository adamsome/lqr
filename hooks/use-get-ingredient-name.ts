import { useCallback, useMemo } from 'react'

import { useData } from '@/components/data-provider'
import {
  Options,
  getIngredientName,
} from '@/lib/ingredient/get-ingredient-name'
import { Ingredient, SpecIngredient } from '@/lib/types'

export function useGetIngredientName() {
  const { ingredientDict } = useData()

  const _getIngredientName = useMemo(
    () => getIngredientName(ingredientDict),
    [ingredientDict]
  )

  return useCallback(
    (ingredient: SpecIngredient | Ingredient, options?: Options) =>
      _getIngredientName(ingredient, options),
    [_getIngredientName]
  )
}
