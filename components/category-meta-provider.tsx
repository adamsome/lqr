'use client'

import { ReactNode, createContext, useContext } from 'react'

import { HierarchicalFilter } from '@/lib/hierarchical-filter'
import { IngredientDef } from '@/lib/types'

export type CategoryMeta = {
  baseIngredientDict: Record<string, IngredientDef>
  categoryFilter: HierarchicalFilter
}

const CategoryMetaContext = createContext<CategoryMeta | undefined>(undefined)

type Props = CategoryMeta & {
  children: ReactNode
}

export const CategoryMetaProvider = ({ children, ...value }: Props) => {
  const { Provider } = CategoryMetaContext
  return <Provider value={value}>{children}</Provider>
}

export const useCategoryMeta = (): CategoryMeta => {
  const context = useContext(CategoryMetaContext)
  if (!context) {
    throw new Error(
      'Called useCategoryMeta before setting CategoryMetaProvider context'
    )
  }
  return context
}
