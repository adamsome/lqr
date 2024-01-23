import { useCallback } from 'react'

import { useIngredientData } from '@/app/components/data-provider'
import { getIngredientPathName } from '@/app/lib/ingredient/get-ingredient-path-name'

export function useGetIngredientPathName() {
  const { dict } = useIngredientData()

  return useCallback(
    (path: string[]) => getIngredientPathName(dict)(path),
    [dict],
  )
}
