import { useMemo } from 'react'

import { useData } from '@/components/data-provider'
import { CATEGORY_DICT, Category } from '@/lib/generated-consts'
import { HierarchicalFilter } from '@/lib/hierarchical-filter'

export function useHierarchicalSpiritsRoot() {
  const { categoryFilter: root } = useData()
  return useMemo(() => {
    const childIDs = root.childIDs.filter((id) => {
      const type = CATEGORY_DICT[id as Category].type
      return type === 'spirit' || type === 'beerWine'
    })
    const children = childIDs.reduce((acc, id) => {
      acc[id] = root.children[id]
      return acc
    }, {} as HierarchicalFilter['children'])
    return { ...root, childIDs, children }
  }, [root])
}
