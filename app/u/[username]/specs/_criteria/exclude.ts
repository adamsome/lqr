import { WithExclude } from './types'

export const parseWithExclude = (value: string): WithExclude<string> =>
  !value.length || value[0] !== '-'
    ? { value, exclude: false }
    : { value: value.substring(1), exclude: true }

export const partitionExclude = <T,>(values: WithExclude<T>[]) => {
  return values.reduce(
    (acc, { value, exclude }) => {
      if (exclude) acc.exclude.add(value)
      else acc.include.add(value)
      return acc
    },
    { include: new Set<T>(), exclude: new Set<T>() },
  )
}
