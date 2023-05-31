import { Column } from '@tanstack/react-table'
import { useMemo } from 'react'

import { useCategoryMeta } from '@/components/category-meta-provider'
import { IngredientPathText } from '@/components/ingredients/ingredient-path-text'
import { DataTableHierarchicalFilter } from '@/components/ui/data-table-hierarchical-filter'
import { CATEGORY_DICT, Category } from '@/lib/consts'
import { HierarchicalFilter } from '@/lib/hierarchical-filter'
import { Ingredient } from '@/lib/types'

type Props = {
  column: Column<Ingredient, unknown>
}

export function IngredientPathFilter(props: Props) {
  const { categoryFilter: root } = useCategoryMeta()

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

  return (
    <DataTableHierarchicalFilter
      {...props}
      defaultValue={filter}
      renderName={(path, full) => (
        <IngredientPathText path={path} full={full} />
      )}
    />
  )
}