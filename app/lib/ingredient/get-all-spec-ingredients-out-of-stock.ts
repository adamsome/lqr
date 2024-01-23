import { sortBy } from 'ramda'

import { Spec } from '@/app/lib/types'

export function getSpecIngredientsOutOfStock(specs: Spec[]) {
  const out: Record<string, number> = {}
  const low: Record<string, number> = {}
  const all: Record<string, number> = {}
  specs.forEach(({ ingredients, stock }) => {
    ingredients.forEach(({ bottleID }, i) => {
      const s = stock?.ingredients[i]
      if (!bottleID || !s) return
      if (s.stock < 1) all[bottleID] = (all[bottleID] ?? 0) + 1
      if (s.stock <= 0) out[bottleID] = (out[bottleID] ?? 0) + 1
      else if (s.stock < 1) low[bottleID] = (low[bottleID] ?? 0) + 1
    })
  })
  const outCounts = sortBy(
    ([, n]) => -n,
    Object.entries(out).filter(([, n]) => n > 5),
  )
  const lowCounts = sortBy(
    ([, n]) => -n,
    Object.entries(low).filter(([, n]) => n > 5),
  )
  const allCounts = sortBy(
    ([, n]) => -n,
    Object.entries(all).filter(([, n]) => n > 5),
  )
  console.log('-- out --')
  outCounts.forEach((it) => console.log(it))
  console.log('-- low --')
  lowCounts.forEach((it) => console.log(it))
  console.log('-- all --')
  allCounts.forEach((it) => console.log(it))
  return { outCounts, lowCounts, allCounts }
}
