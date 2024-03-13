import { asArray } from '@/app/lib/utils'
import { NavigateOptions } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

const negateStr = (value: string) =>
  value[0] === '-' ? value.substring(1) : `-${value}`

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

  const negateQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      const values = params.getAll(name)
      if (values.includes(value)) {
        params.delete(name, value)
        params.append(name, negateStr(value))
      } else {
        if (values.includes(negateStr(value))) {
          params.delete(name, negateStr(value))
        }
        params.append(name, value)
      }

      return params.toString()
    },
    [searchParams],
  )

  const clearQueryString = useCallback(
    (name?: string | string[], value?: string) => {
      if (!name) return ''
      const params = new URLSearchParams(searchParams)
      const names = asArray(name)
      const valuesPerName = names.map((n) => params.getAll(n))
      names.forEach((n) => params.delete(n))
      if (value) {
        names.forEach((n, i) =>
          valuesPerName[i]
            .filter((val) => val !== value)
            .forEach((v) => params.append(n, v)),
        )
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
    (name?: string | string[], value?: string, options?: NavigateOptions) =>
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

  const negate = useCallback(
    (name?: string, value?: string, options?: NavigateOptions) => {
      if (name && value)
        pushQueryString(negateQueryString(name, value), options)
    },
    [pushQueryString, negateQueryString],
  )

  return { set, append, negate, clear, searchParams }
}
