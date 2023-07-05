import { useCallback, useMemo } from 'react'

import { useData } from '@/components/data-provider'
import { getIngredientDefs } from '@/lib/ingredient/get-ingredient-defs'

export function useGetIngredientDefs() {
  const { ingredientDict } = useData()

  const _getIngredientDefs = useMemo(
    () => getIngredientDefs(ingredientDict),
    [ingredientDict]
  )

  return useCallback(
    (id: string) => _getIngredientDefs(id),
    [_getIngredientDefs]
  )
}
