import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { usePrevious } from 'react-use'

export function useMutate(url: string, data?: unknown) {
  const [fetching, setFetching] = useState(false)
  const prev = usePrevious(data)
  const router = useRouter()

  useEffect(() => {
    if (data !== undefined && data !== prev) {
      setFetching(false)
    }
  }, [data, prev])

  const refresh = useCallback(() => {
    router.refresh()
    setFetching(data !== undefined ? true : false)
  }, [data, router])

  const doFetch = useCallback(
    async (init?: RequestInit | undefined) => {
      setFetching(true)
      try {
        await fetch(url, init)
      } catch (err: any) {
        console.error(`Error updating '${url}'`, err?.data ?? err)
        setFetching(false)
      }
      refresh()
    },
    [url, refresh]
  )

  return [fetching, doFetch] as const
}
