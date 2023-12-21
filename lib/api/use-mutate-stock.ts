import { UseMutateOptions, useMutate } from '@/lib/api/use-mutate'
import { API_STOCK } from '@/lib/routes'
import { useCallback } from 'react'

export function useMutateStock(options: UseMutateOptions = {}) {
  const { mutating, mutate } = useMutate(API_STOCK, options)

  const doMutate = useCallback(
    (ingredientID: string, stock = -1) =>
      mutate({
        method: 'PUT',
        body: JSON.stringify({
          ingredientID,
          stock,
        }),
      }),
    [mutate],
  )

  return { mutating, mutate: doMutate }
}
