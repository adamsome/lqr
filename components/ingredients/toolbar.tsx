'use client'

import { Table } from '@tanstack/react-table'
import { X } from 'lucide-react'

import { StockIcon as BaseStockIcon } from '@/components/ingredients/stock-icon'
import { Button } from '@/components/ui/button'
import { DataTableColumnFilterInput } from '@/components/ui/data-table-column-filter-input'
import {
  DataTableFacetedFilter,
  DataTableFacetedFilterItem,
} from '@/components/ui/data-table-faceted-filter'
import { DataTableViewOptions } from '@/components/ui/data-table-view-options'
import { Ingredient } from '@/lib/types'
import { StockState, getStockState } from '@/lib/stock'

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

type Props = {
  table: Table<Ingredient>
}

export function Toolbar({ table }: Props) {
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
          <DataTableFacetedFilter
            column={table.getColumn('stock')}
            title="In Stock"
            icon={<StockIcon stock="full" />}
            options={stock}
            transformFacetsFn={transformStockFacets}
          />
        )}
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
      <DataTableViewOptions table={table} />
    </div>
  )
}
