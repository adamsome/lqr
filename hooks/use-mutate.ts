import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { usePrevious } from 'react-use'

import { useToast } from '@/components/ui/use-toast'

export type UseMutateOptions = {
  watchData?: unknown
}

export function useMutate<T = unknown>(
  url: string,
  { watchData }: UseMutateOptions = {},
) {
  const [mutating, setMutating] = useState(false)
  const [error, setError] = useState('')
  const prev = usePrevious(watchData)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (watchData !== undefined && watchData !== prev) {
      setMutating(false)
    }
  }, [watchData, prev])

  const refresh = useCallback(() => {
    router.refresh()
    setMutating(watchData !== undefined ? true : false)
  }, [watchData, router])

  const handleError = useCallback(
    (err: any) => {
      let msg = (err?.data ?? err) as string
      if (typeof msg !== 'string') msg = `Unknown error updating '${url}'`
      console.error(msg, err?.data ?? err)
      toast({ title: msg, variant: 'destructive' })
      setError(msg)
      setMutating(false)
      return { error: msg }
    },
    [url, toast],
  )

  const mutate = useCallback(
    async (
      init?: RequestInit | undefined,
    ): Promise<{ data?: T; error?: string }> => {
      setMutating(true)
      setError('')
      let res
      try {
        res = await fetch(url, init)
        const data = (await res.json()) as T
        if (res.ok && res.status === 200) {
          refresh()
          return { data }
        }
        return handleError(data)
      } catch (err: any) {
        return handleError(err)
      }
    },
    [url, handleError, refresh],
  )

  return { mutating, error, mutate }
}
