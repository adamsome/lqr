import { useCallback } from 'react'

import { useIngredientData } from '@/components/data-provider'
import { getIngredientPathName } from '@/lib/ingredient/get-ingredient-path-name'

export function useGetIngredientPathName() {
  const { dict } = useIngredientData()

  return useCallback(
    (path: string[]) => getIngredientPathName(dict)(path),
    [dict]
  )
}
