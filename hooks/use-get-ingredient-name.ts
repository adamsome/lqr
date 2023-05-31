import { useCallback, useMemo } from 'react'

import { useCategoryMeta } from '@/components/category-meta-provider'
import { getIngredientName } from '@/lib/ingredient/get-ingredient-name'
import { SpecIngredient } from '@/lib/types'

export function useGetIngredientName() {
  const { baseIngredientDict } = useCategoryMeta()

  const _getIngredientName = useMemo(
    () => getIngredientName(baseIngredientDict),
    [baseIngredientDict]
  )

  return useCallback(
    (ingredient: SpecIngredient) => _getIngredientName(ingredient),
    [_getIngredientName]
  )
}
