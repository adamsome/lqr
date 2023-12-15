import {
  Criteria,
  SearchParams,
} from '@/app/u/[username]/specs/_criteria/types'
import {
  CATEGORY_KEY,
  DEFAULT_LIMIT,
  INGREDIENT_KEY,
  LIMIT_KEY,
  SEARCH_KEY,
  SORT_DESC_KEY,
  SORT_KEY,
  SpecSort,
  USER_KEY,
} from '@/app/u/[username]/specs/_criteria/consts'
import { parseIngredientCriterion } from '@/app/u/[username]/specs/_criteria/ingredient-criterion'
import { asArray, head, rejectNil } from '@/lib/utils'

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
    sort: head(searchParams[SORT_KEY] as SpecSort | SpecSort[] | undefined),
    desc: Boolean(searchParams[SORT_DESC_KEY]),
    limit: Number(head(searchParams[LIMIT_KEY]) ?? DEFAULT_LIMIT),
    username,
  }
}
