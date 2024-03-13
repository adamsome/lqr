'use client'

import { Box as CategoryBox } from '../bar/[cabinet]/[shelf]/[category]/box'
import { BarCategory, BarCategoryDef } from '../bar/lib/types'
import { BAR_CATEGORY_KEY } from './_criteria/consts'
import { parseWithExclude, partitionExclude } from './_criteria/exclude'
import { ExcludeState } from './_criteria/types'
import { useRouterSearchParams } from './use-router-search-params'

type Props = {
  username?: string
  def: BarCategoryDef
  category?: BarCategory
  isCurrentUser: boolean
}

export function BarCategoryFilter({
  username,
  def,
  category,
  isCurrentUser,
}: Props) {
  const { searchParams, append, negate, clear } = useRouterSearchParams()
  if (!category) return null
  const { include, exclude } = partitionExclude(
    searchParams.getAll(BAR_CATEGORY_KEY).map(parseWithExclude),
  )
  let filterState: ExcludeState = 'none'
  if (def.keys.category != null) {
    if (include.has(def.keys.category)) filterState = 'include'
    if (exclude.has(def.keys.category)) filterState = 'exclude'
  }
  return (
    <CategoryBox
      username={username}
      def={def}
      category={category}
      isCurrentUser={isCurrentUser}
      filterState={filterState}
      onCategoryClick={({ keys }) => {
        let value = keys.category
        if (!value) {
          throw new Error(`No category key found to filter on.`)
        }
        if (!include.has(value) && !exclude.has(value)) {
          return append(BAR_CATEGORY_KEY, value)
        }
        const negatedValue = `-${value}`
        return include.has(value)
          ? negate(BAR_CATEGORY_KEY, negatedValue)
          : clear(BAR_CATEGORY_KEY, negatedValue)
      }}
    />
  )
}
