import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'

import { useToast } from '@/app/components/ui/use-toast'

export type UseMutateOptions = {
  watchData?: unknown
}

export function useMutate<T = unknown>(
  url: string,
  { watchData }: UseMutateOptions = {},
) {
  const [mutating, setMutating] = useState(false)
  const [error, setError] = useState('')
  const [prevWatchData, setPrevWatchData] = useState(watchData)
  const router = useRouter()
  const { toast } = useToast()

  // When the watched server data changes the mutation has landed. Adjust state
  // during render (not in an effect); watchData must be a primitive.
  if (watchData !== prevWatchData) {
    setPrevWatchData(watchData)
    if (watchData !== undefined) setMutating(false)
  }

  const refresh = useCallback(() => {
    router.refresh()
    setMutating(watchData !== undefined ? true : false)
  }, [watchData, router])

  const handleError = useCallback(
    (err: any) => {
      let msg = (err?.error ?? err?.data ?? err) as string
      if (typeof msg !== 'string') msg = `Unknown error updating '${url}'`
      console.error(msg)
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
