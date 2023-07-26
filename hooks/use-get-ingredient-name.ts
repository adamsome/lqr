import { useCallback, useMemo } from 'react'

import { useIngredientData } from '@/components/data-provider'
import {
  Options,
  getIngredientName,
} from '@/lib/ingredient/get-ingredient-name'
import { Ingredient, SpecIngredient } from '@/lib/types'

export function useGetIngredientName() {
  const { dict } = useIngredientData()

  const _getIngredientName = useMemo(() => getIngredientName(dict), [dict])

  return useCallback(
    (ingredient: SpecIngredient | Ingredient, options?: Options) =>
      _getIngredientName(ingredient, options),
    [_getIngredientName]
  )
}
