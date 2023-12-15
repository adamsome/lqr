import { SpecSort } from '@/app/u/[username]/specs/_criteria/consts'
import { SpecIngredient } from '@/lib/types'

export type SearchParams = {
  [key: string]: string | string[] | undefined
}

export type Criteria = {
  search: string
  categories: string[]
  users: string[]
  ingredients: SpecIngredient[]
  sort?: SpecSort
  desc: boolean
  limit: number
  username?: string
}
