import { useCallback, useMemo } from 'react'

import { useData } from '@/components/data-provider'
import { getIngredientName } from '@/lib/ingredient/get-ingredient-name'
import { SpecIngredient } from '@/lib/types'

export function useGetIngredientName() {
  const { baseIngredientDict } = useData()

  const _getIngredientName = useMemo(
    () => getIngredientName(baseIngredientDict),
    [baseIngredientDict]
  )

  return useCallback(
    (ingredient: SpecIngredient) => _getIngredientName(ingredient),
    [_getIngredientName]
  )
}
