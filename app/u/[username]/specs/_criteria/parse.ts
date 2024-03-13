import { asArray, head, rejectNil } from '@/app/lib/utils'
import {
  BAR_CATEGORY_KEY,
  CATEGORY_KEY,
  DEFAULT_LIMIT,
  INGREDIENT_KEY,
  LIMIT_KEY,
  SEARCH_KEY,
  SORT_DESC_KEY,
  SORT_KEY,
  SpecSort,
  USER_KEY,
} from './consts'
import { parseWithExclude } from './exclude'
import { parseIngredientCriterion } from './ingredient-criterion'
import { Criteria, SearchParams } from './types'

export function parseCriteria(
  searchParams: SearchParams,
  username?: string,
): Criteria {
  return {
    search: head(searchParams[SEARCH_KEY]) ?? '',
    categories: asArray(searchParams[CATEGORY_KEY] ?? []),
    users: asArray(searchParams[USER_KEY] ?? []),
    ingredients: rejectNil(
      asArray(searchParams[INGREDIENT_KEY] ?? []).map(parseIngredientCriterion),
    ),
    barCategories: asArray(searchParams[BAR_CATEGORY_KEY] ?? []).map(
      parseWithExclude,
    ),
    sort: head(searchParams[SORT_KEY] as SpecSort | SpecSort[] | undefined),
    desc: Boolean(searchParams[SORT_DESC_KEY]),
    limit: Number(head(searchParams[LIMIT_KEY]) ?? DEFAULT_LIMIT),
    username,
  }
}
