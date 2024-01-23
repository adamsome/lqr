import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getDictValue = (
  value: string,
  dict: Record<string, { name: string }>,
) => (value === '__na' ? '' : dict[value].name)

export const getBoolValue = (value: string) => (value === '__na' ? '' : value)

export function compareBasic(a: any, b: any) {
  return a === b ? 0 : a > b ? 1 : -1
}

export function toString(a: any) {
  if (typeof a === 'number') {
    if (isNaN(a) || a === Infinity || a === -Infinity) {
      return ''
    }
    return String(a)
  }
  if (typeof a === 'string') {
    return a
  }
  return ''
}

export function capitalize(str: string): string {
  return str[0].toUpperCase() + str.slice(1)
}

export function rejectNil<T>(arr: (T | undefined | null)[]): T[] {
  return arr.filter((it) => it != null) as T[]
}

export function rejectFalsy<T>(arr: (T | undefined | null)[]): T[] {
  return arr.filter((it) => it) as T[]
}

export function slugify(
  str: string,
  { replaceSpaces = '-' }: { replaceSpaces?: string } = {},
): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, replaceSpaces)
}

export function asArray<T>(arrayOrElement: T | T[] | null | undefined): T[] {
  if (!arrayOrElement) return []
  return Array.isArray(arrayOrElement) ? arrayOrElement : [arrayOrElement]
}

export function head<T>(arrayOrElement: T | T[]): T
export function head<T>(arrayOrElement?: T | T[] | null): T | undefined {
  const array = asArray<T>(arrayOrElement)
  return array != null && array.length ? array[0] : undefined
}

export function toDict<T, TKey extends string | number | symbol = string>(
  arr: T[] | undefined | null,
  keyAccessor?: (it: T) => TKey,
): Record<TKey, T> {
  const keyFn =
    keyAccessor ??
    ((it: T) => ((it as Record<string, unknown>).id ?? String(it)) as TKey)
  return (arr ?? []).reduce(
    (acc, it) => {
      acc[keyFn(it)] = it
      return acc
    },
    {} as Record<TKey, T>,
  )
}

export const toTruthMap = <T, TKey extends string | number | symbol = string>(
  arr: T[] | undefined | null,
  keyAccessor: (it: T) => TKey = (it) => it as unknown as TKey,
): Record<TKey, boolean> =>
  (arr ?? []).reduce(
    (acc, it) => {
      acc[keyAccessor(it)] = true
      return acc
    },
    {} as Record<TKey, boolean>,
  )
