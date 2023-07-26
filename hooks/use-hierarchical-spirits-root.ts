import { useMemo } from 'react'

import { useIngredientData } from '@/components/data-provider'
import { CATEGORY_DICT, Category } from '@/lib/generated-consts'
import { HierarchicalFilter } from '@/lib/hierarchical-filter'

export function useHierarchicalSpiritsRoot() {
  const { tree } = useIngredientData()
  return useMemo(() => {
    const childIDs = tree.childIDs.filter((id) => {
      const type = CATEGORY_DICT[id as Category].type
      return type === 'spirit' || type === 'beerWine'
    })
    const children = childIDs.reduce((acc, id) => {
      acc[id] = tree.children[id]
      return acc
    }, {} as HierarchicalFilter['children'])
    return { ...tree, childIDs, children }
  }, [tree])
}
