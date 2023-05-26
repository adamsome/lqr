'use client'

import { X } from 'lucide-react'
import { useCallback, useMemo } from 'react'

import { useCategoryMeta } from '@/components/category-meta-provider'
import { StockIcon as BaseStockIcon } from '@/components/ingredients/stock-icon'
import { Button } from '@/components/ui/button'
import { DataTableToolbarProps } from '@/components/ui/data-table'
import { DataTableColumnFilterInput } from '@/components/ui/data-table-column-filter-input'
import {
  DataTableFacetFilterButton,
  DataTableFacetedFilterItem,
} from '@/components/ui/data-table-facet-filter-button'
import { DataTableHierarchicalFacetFilterButton } from '@/components/ui/data-table-hierarchical-facet-filter-button'
import { DataTableViewOptions } from '@/components/ui/data-table-view-options'
import { CATEGORY_DICT, Category } from '@/lib/consts'
import { HierarchicalFilter } from '@/lib/hierarchical-filter'
import { StockState, getStockState } from '@/lib/stock'
import { Ingredient } from '@/lib/types'

function StockIcon(props: { stock: StockState }) {
  return (
    <div className="mr-2 scale-[.8] transform">
      <BaseStockIcon {...props} />
    </div>
  )
}

const stock: DataTableFacetedFilterItem[] = [
  { label: 'Full', value: 'full', icon: <StockIcon stock="full" /> },
  { label: 'Low', value: 'low', icon: <StockIcon stock="low" /> },
  { label: 'Missing', value: 'none', icon: <StockIcon stock="none" /> },
]

function transformStockFacets(facets: Map<any, number>) {
  const result = new Map<StockState, number>()
  facets.forEach((count, stock) => {
    const state = getStockState(stock)
    const curr = result.get(state) ?? 0
    result.set(state, curr + count)
  })
  return result
}

function transformCategoryFacets(facets: Map<any, number>) {
  const result = new Map<string, number>()
  facets.forEach((count, rawIDs) => {
    const ids = String(rawIDs).split('|')
    ids.forEach((id) => {
      const curr = result.get(id) ?? 0
      result.set(id, curr + count)
    })
  })
  return result
}

type Props = DataTableToolbarProps<Ingredient>

export function Toolbar({ table, hideColumns }: Props) {
  const { baseIngredientDict, categoryFilter: root } = useCategoryMeta()

  const categoryRoot = useMemo(() => {
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

  const isFiltered =
    table.getPreFilteredRowModel().rows.length >
    table.getFilteredRowModel().rows.length

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center gap-2">
        <DataTableColumnFilterInput
          id="name"
          placeholder="Filter Names..."
          table={table}
        />
        {table.getColumn('stock') && (
          <DataTableFacetFilterButton
            column={table.getColumn('stock')}
            title="In Stock"
            icon={<StockIcon stock="full" />}
            items={stock}
            transformFacetsFn={transformStockFacets}
          />
        )}
        <DataTableHierarchicalFacetFilterButton
          column={table.getColumn('ancestors')}
          title="Category"
          root={categoryRoot}
          getName={getName}
          transformFacetsFn={transformCategoryFacets}
        />
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} hideColumns={hideColumns} />
    </div>
  )
}
