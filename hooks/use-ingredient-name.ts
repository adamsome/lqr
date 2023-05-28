import { useCallback } from 'react'

import { useCategoryMeta } from '@/components/category-meta-provider'
import { getIngredientName } from '@/hooks/get-ingredient-name'

export function useIngredientName() {
  const { baseIngredientDict } = useCategoryMeta()

  return useCallback(
    (path: string[], options: { full?: boolean } = {}) =>
      getIngredientName(baseIngredientDict)(path, options),
    [baseIngredientDict]
  )
}
