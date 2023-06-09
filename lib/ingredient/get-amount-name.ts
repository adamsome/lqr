import { Amount, Unit } from '@/lib/types'
import { capitalize, rejectFalsy } from '@/lib/utils'

function near(num: number, target: number, within = 0.001) {
  return target - within < num && num < target + within
}

function getQuantityStr(quantity?: number): string {
  if (!quantity) return ''
  const floor = Math.floor(quantity)
  const decimal = quantity - floor
  let num = floor ? String(floor) : ''
  if (near(decimal, 1 / 8)) return `${num} 1/8`
  if (near(decimal, 1 / 4)) return `${num} 1/4`
  if (near(decimal, 3 / 8)) return `${num} 3/8`
  if (near(decimal, 1 / 2)) return `${num} 1/2`
  if (near(decimal, 5 / 8)) return `${num} 5/8`
  if (near(decimal, 3 / 4)) return `${num} 3/4`
  if (near(decimal, 7 / 8)) return `${num} 7/8`
  return num
}

function join(arr: (string | undefined)[]): string {
  return rejectFalsy(arr).join(' ')
}

function pluralize(str?: string, value?: number) {
  if (!str || !value || value <= 1) return str
  const suffix = str.endsWith('h') || str.endsWith('s') ? 'es' : 's'
  return `${str}${suffix}`
}

function getAmountStr(q?: number, unit?: Unit): string | undefined {
  return !unit && (!q || q === 1)
    ? undefined
    : join([
        getQuantityStr(q),
        unit === 'dash' || unit === 'cube' ? pluralize(unit, q) : unit,
      ])
}

export function getSpecAmountName(amount: Amount): [string?, string?] {
  const { quantity: q, usage, unit } = amount
  if (q || usage || unit) console.log('amt', amount)
  switch (usage) {
    case 'rim':
      if (!q || q === 1) return [, usage]
      return [getQuantityStr(q), usage]
    case 'twist':
    case 'wedge':
    case 'wheel':
    case 'rinse':
      return [getAmountStr(q, unit), pluralize(usage, q)]
    case 'grated':
    case 'muddled':
      if (!q && !unit) return [capitalize(usage)]
      return [join([getAmountStr(q, unit), usage])]
    case 'float':
      return [join(['Float', getAmountStr(q, unit)])]
    case 'top':
      return [join(['Top w/', getAmountStr(q, unit)])]
    case 'whole':
    default:
      return [getAmountStr(q, unit)]
  }
}
