import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

export function useRouterSearchParams() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams() as unknown as URLSearchParams

  const appendQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.append(name, value)

      return params.toString()
    },
    [searchParams]
  )

  const clearQueryString = useCallback(
    (name?: string, value?: string) => {
      if (!name) return ''
      const params = new URLSearchParams(searchParams)
      const values = params.getAll(name)
      params.delete(name)
      if (value) {
        values
          .filter((val) => val !== value)
          .forEach((v) => params.append(name, v))
      }
      return params.toString()
    },
    [searchParams]
  )

  const pushQueryString = useCallback(
    (searchParam: string) => router.push(`${pathname}?${searchParam}`),
    [router, pathname]
  )

  const clear = useCallback(
    (name?: string, value?: string) =>
      pushQueryString(clearQueryString(name, value)),
    [pushQueryString, clearQueryString]
  )

  const append = useCallback(
    (name?: string, value?: string) => {
      if (name && value) pushQueryString(appendQueryString(name, value))
    },
    [pushQueryString, appendQueryString]
  )

  return { append, clear, searchParams }
}
