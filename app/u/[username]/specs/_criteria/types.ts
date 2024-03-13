import { Spec, SpecIngredient } from '@/app/lib/types'
import { SpecSort } from './consts'

export type SearchParams = {
  [key: string]: string | string[] | undefined
}

export type ExcludeState = 'exclude' | 'include' | 'none'

export type WithExclude<T> = {
  value: T
  exclude: boolean
}

export type Criteria = {
  search: string
  categories: string[]
  users: string[]
  ingredients: SpecIngredient[]
  barCategories: WithExclude<string>[]
  sort?: SpecSort
  desc: boolean
  limit: number
  username?: string
}

export type SpecApplied = Spec & {
  barCategoryCount?: number
}
