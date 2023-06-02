import { useCallback } from 'react'

import { useData } from '@/components/category-meta-provider'
import { getIngredientPathName } from '@/lib/ingredient/get-ingredient-path-name'

export function useGetIngredientPathName() {
  const { baseIngredientDict } = useData()

  return useCallback(
    (path: string[], options: { full?: boolean } = {}) =>
      getIngredientPathName(baseIngredientDict)(path, options),
    [baseIngredientDict]
  )
}
