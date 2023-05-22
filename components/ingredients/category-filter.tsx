import { Column } from '@tanstack/react-table'
import { useCallback, useMemo } from 'react'

import { useCategoryMeta } from '@/components/category-meta-provider'
import { DataTableHierarchicalFilter } from '@/components/ui/data-table-hierarchical-filter'
import { CATEGORY_DICT, Category } from '@/lib/consts'
import { HierarchicalFilter } from '@/lib/hierarchical-filter'
import { Ingredient } from '@/lib/types'

type Props = {
  column: Column<Ingredient, unknown>
}

export function CategoryFilter(props: Props) {
  const { baseIngredientDict, categoryFilter: root } = useCategoryMeta()

  const filter = useMemo(() => {
    const childIDs = root.childIDs.filter(
      (id) => CATEGORY_DICT[id as Category].type === 'spirit'
    )
    const children = childIDs.reduce((acc, id) => {
      acc[id] = root.children[id]
      return acc
    }, {} as HierarchicalFilter['children'])
    return { ...root, childIDs, children }
  }, [root])

  const getName = useCallback(
    (path: string[]) => {
      if (path.length > 1)
        return baseIngredientDict[path[path.length - 1]]?.name
      if (path.length === 1) return CATEGORY_DICT[path[0] as Category].name
    },
    [baseIngredientDict]
  )

  return (
    <DataTableHierarchicalFilter
      {...props}
      defaultValue={filter}
      getName={getName}
    />
  )
}
