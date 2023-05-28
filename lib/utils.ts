import { ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getDictValue = (
  value: string,
  dict: Record<string, { name: string }>
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
