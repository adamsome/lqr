import { Column } from '@tanstack/react-table'
import { useMemo } from 'react'

import { useData } from '@/components/data-provider'
import { IngredientPathText } from '@/components/ingredient-path/text'
import { DataTableHierarchicalFilter } from '@/components/ui/data-table-hierarchical-filter'
import { CATEGORY_DICT, Category } from '@/lib/generated-consts'
import { HierarchicalFilter } from '@/lib/hierarchical-filter'
import { Ingredient } from '@/lib/types'

type Props = {
  column: Column<Ingredient, unknown>
}

export function IngredientPathFilter(props: Props) {
  const { categoryFilter: root } = useData()

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
      renderName={(path, full) =>
        full ? (
          <IngredientPathText path={path} />
        ) : (
          <IngredientPathText id={path[path.length - 1]} />
        )
      }
    />
  )
}
