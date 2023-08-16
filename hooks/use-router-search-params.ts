import { NavigateOptions } from 'next/dist/shared/lib/app-router-context'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

export function useRouterSearchParams() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams() as unknown as URLSearchParams

  const setQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)

      return params.toString()
    },
    [searchParams],
  )

  const appendQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.append(name, value)

      return params.toString()
    },
    [searchParams],
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
    [searchParams],
  )

  const pushQueryString = useCallback(
    (searchParam: string, options?: NavigateOptions) =>
      router.push(`${pathname}?${searchParam}`, options),
    [router, pathname],
  )

  const clear = useCallback(
    (name?: string, value?: string, options?: NavigateOptions) =>
      pushQueryString(clearQueryString(name, value), options),
    [pushQueryString, clearQueryString],
  )

  const set = useCallback(
    (name: string, value: string, options?: NavigateOptions) => {
      pushQueryString(setQueryString(name, value), options)
    },
    [pushQueryString, setQueryString],
  )

  const append = useCallback(
    (name?: string, value?: string, options?: NavigateOptions) => {
      if (name && value)
        pushQueryString(appendQueryString(name, value), options)
    },
    [pushQueryString, appendQueryString],
  )

  return { set, append, clear, searchParams }
}
