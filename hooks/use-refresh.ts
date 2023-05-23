import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

export function useRefresh(data?: unknown) {
  const [fetching, setFetching] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (data !== undefined) {
      setFetching(false)
    }
  }, [data])

  const refresh = useCallback(() => {
    router.refresh()
    if (data !== undefined) {
      setFetching(true)
    }
  }, [data, router])

  return { refresh, fetching }
}
