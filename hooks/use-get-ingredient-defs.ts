import { useCallback, useMemo } from 'react'

import { useCategoryMeta } from '@/components/category-meta-provider'
import { getIngredientDefs } from '@/lib/ingredient/get-ingredient-defs'

export function useGetIngredientDefs() {
  const { baseIngredientDict } = useCategoryMeta()

  const _getIngredientDefs = useMemo(
    () => getIngredientDefs(baseIngredientDict),
    [baseIngredientDict]
  )

  return useCallback(
    (id: string) => _getIngredientDefs(id),
    [_getIngredientDefs]
  )
}
