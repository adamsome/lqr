import { useMemo } from 'react'

import { useIngredientData } from '@/app/components/data-provider'
import {
  CATEGORY_DICT,
  Category,
  CategoryDef,
} from '@/app/lib/generated-consts'
import { HierarchicalFilter } from '@/app/lib/hierarchical-filter'

export function useFilterIngredientTree(
  ...categories: NonNullable<CategoryDef['type']>[]
) {
  const { tree } = useIngredientData()
  return useMemo(() => {
    const childIDs = tree.childIDs.filter((id) => {
      const type = CATEGORY_DICT[id as Category].type
      return type && categories.includes(type)
    })
    const children = childIDs.reduce(
      (acc, id) => {
        acc[id] = tree.children[id]
        return acc
      },
      {} as HierarchicalFilter['children'],
    )
    return { ...tree, childIDs, children }
  }, [tree, categories])
}
