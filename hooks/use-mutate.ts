import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

export function useMutate(url: string, data?: unknown) {
  const [fetching, setFetching] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (data !== undefined) {
      setFetching(false)
    }
  }, [data])

  const refresh = useCallback(() => {
    router.refresh()
    setFetching(data !== undefined ? true : false)
  }, [data, router])

  const doFetch = useCallback(
    async (init?: RequestInit | undefined) => {
      setFetching(true)
      await fetch(url, init)
      refresh()
    },
    [url, refresh]
  )

  return [fetching, doFetch] as const
}
