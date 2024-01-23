import { useCallback, useMemo } from 'react'

import { useIngredientData } from '@/app/components/data-provider'
import {
  Options,
  getIngredientName,
} from '@/app/lib/ingredient/get-ingredient-name'
import { Ingredient, SpecIngredient } from '@/app/lib/types'

export function useGetIngredientName() {
  const { dict } = useIngredientData()

  const _getIngredientName = useMemo(() => getIngredientName(dict), [dict])

  return useCallback(
    (ingredient: SpecIngredient | Ingredient, options?: Options) =>
      _getIngredientName(ingredient, options),
    [_getIngredientName],
  )
}
