import { useCallback } from 'react'

import { useData } from '@/components/data-provider'
import { getIngredientPathName } from '@/lib/ingredient/get-ingredient-path-name'

export function useGetIngredientPathName() {
  const { ingredientDict } = useData()

  return useCallback(
    (path: string[]) => getIngredientPathName(ingredientDict)(path),
    [ingredientDict]
  )
}
