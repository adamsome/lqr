'use client'

import { ColumnDef } from '@tanstack/react-table'
import { ReactNode } from 'react'

import { ActionCell } from '@/components/ingredients/action-cell'
import { CategoryCell } from '@/components/ingredients/category-cell'
import { CategoryFilter } from '@/components/ingredients/category-filter'
import { StockCell } from '@/components/ingredients/stock-cell'
import { StockIcon } from '@/components/ingredients/stock-icon'
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header'
import {
  DataTableFacetFilter,
  createFacetFilterFn,
} from '@/components/ui/data-table-facet-filter'
import { AGING_DICT, PRODUCTION_METHOD_DICT } from '@/lib/consts'
import { hierarchicalFilterFn } from '@/lib/hierarchical-filter'
import { getStockState } from '@/lib/stock'
import { Ingredient } from '@/lib/types'

function createFacetColumn<T, K extends keyof T & string>(
  key: K,
  name: string,
  accessorFn: (value: T[K]) => string,
  tooltip?: ReactNode
): ColumnDef<T> {
  return {
    accessorKey: key,
    accessorFn: (row) => accessorFn(row[key]),
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        filter={<DataTableFacetFilter column={column} />}
        tooltip={tooltip}
      >
        {name}
      </DataTableColumnHeader>
    ),
    filterFn: createFacetFilterFn(key),
  }
}

type Column<T> = ColumnDef<T> & {
  className?: string
}

export const columns: Column<Ingredient>[] = [
  {
    accessorKey: 'stock',
    accessorFn: (row) => row.stock ?? -1,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} tooltip="In Stock">
        <div className="-mr-2 flex h-8 w-8 items-center justify-center">
          <StockIcon header />
        </div>
      </DataTableColumnHeader>
    ),
    cell: ({ row }) => (
      <StockCell ingredientID={row.original.id} stock={row.getValue('stock')} />
    ),
    filterFn: (row, id, value) =>
      value.includes(getStockState(row.getValue(id))),
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column}>Name</DataTableColumnHeader>
    ),
  },
  {
    accessorKey: 'ancestors',
    accessorFn: (row) =>
      [row.category, ...row.ancestors.map((a) => a.id)].join('|'),
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        filter={<CategoryFilter column={column} />}
      >
        Category
      </DataTableColumnHeader>
    ),
    cell: ({ row }) => <CategoryCell ingredient={row.original} />,
    filterFn: hierarchicalFilterFn((row) => {
      const { ancestors, category } = row.original
      return [category as string].concat(ancestors.map((a) => a.id))
    }),
  },
  createFacetColumn('productionMethod', 'Method', (value) =>
    value ? PRODUCTION_METHOD_DICT[value].name : ''
  ),
  createFacetColumn('aging', 'Aging', (value) =>
    value ? AGING_DICT[value].name : ''
  ),
  createFacetColumn('black', 'Black', (value) => (value ? 'Black' : '')),
  createFacetColumn(
    'overproof',
    'OP',
    (value) => (value ? 'OP' : ''),
    'Overproof'
  ),
  {
    accessorKey: 'origin',
    header: ({ column }) => (
      <DataTableColumnHeader column={column}>Origin</DataTableColumnHeader>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => <ActionCell ingredient={row.original} />,
    className: 'pr-1',
  },
]
