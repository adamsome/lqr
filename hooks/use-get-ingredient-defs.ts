import { useCallback, useMemo } from 'react'

import { useIngredientData } from '@/components/data-provider'
import { getIngredientDefs } from '@/lib/ingredient/get-ingredient-defs'

export function useGetIngredientDefs() {
  const { dict } = useIngredientData()

  const _getIngredientDefs = useMemo(() => getIngredientDefs(dict), [dict])

  return useCallback(
    (id: string) => _getIngredientDefs(id),
    [_getIngredientDefs]
  )
}
