'use client'

import { ColumnDef } from '@tanstack/react-table'

import { ActionCell } from '@/app/research/action-cell'
import { StockCell } from '@/app/research/stock-cell'
import { IngredienFullName } from '@/app/components/ingredient-full-name'
import { StockIcon } from '@/app/components/stock-icon'
import { DataTableColumnHeader as Header } from '@/app/components/ui/data-table/data-table-column-header'
import { AGING_DICT, PRODUCTION_METHOD_DICT } from '@/app/lib/generated-consts'
import { hierarchicalFilterFn } from '@/app/lib/hierarchical-filter'
import { getIngredientPathName } from '@/app/lib/ingredient/get-ingredient-path-name'
import { getStockState } from '@/app/lib/stock'
import { Ingredient, WithPath } from '@/app/lib/types'
import {
  compareBasic,
  getBoolValue,
  getDictValue,
  toString,
} from '@/app/lib/utils'

type Column<T> = ColumnDef<T> & {
  className?: string
}

const STOCK_COL: Column<WithPath<Ingredient>> = {
  accessorKey: 'stock',
  accessorFn: (row) => row.stock ?? -1,
  header: ({ column }) => (
    <Header column={column} tooltip="In Stock">
      <div className="-mr-2 flex h-8 w-8 items-center justify-center">
        <StockIcon header />
      </div>
    </Header>
  ),
  cell: ({ row }) => (
    <StockCell ingredientID={row.original.id} stock={row.getValue('stock')} />
  ),
  filterFn: (row, id, value) => value.includes(getStockState(row.getValue(id))),
}

export const createColumns = (
  dict: Record<string, Ingredient>,
  { showStock }: { showStock?: boolean } = {},
): Column<WithPath<Ingredient>>[] => {
  const getPathName = getIngredientPathName(dict)
  return [
    ...(showStock ? [STOCK_COL] : []),
    {
      accessorKey: 'name',
      header: ({ column }) => <Header column={column}>Name</Header>,
    },
    {
      accessorKey: 'ancestors',
      accessorFn: (row) => row.path.join('|'),
      sortingFn: (a, b, id) => {
        const aPath = (a.getValue(id) as string).split('|')
        const bPath = (b.getValue(id) as string).split('|')
        return compareBasic(
          toString(getPathName(aPath)).toLowerCase(),
          toString(getPathName(bPath)).toLowerCase(),
        )
      },
      header: ({ column }) => <Header column={column}>Category</Header>,
      cell: ({ row }) => <IngredienFullName path={row.original.path} />,
      filterFn: hierarchicalFilterFn((row) => row.original.path),
    },
    {
      accessorKey: 'productionMethod',
      accessorFn: (row) => row.productionMethod ?? '__na',
      header: ({ column }) => <Header column={column}>Method</Header>,
      cell: ({ row }) =>
        getDictValue(row.getValue('productionMethod'), PRODUCTION_METHOD_DICT),
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
      accessorKey: 'aging',
      accessorFn: (row) => row.aging ?? '__na',
      header: ({ column }) => <Header column={column}>Aging</Header>,
      cell: ({ row }) => getDictValue(row.getValue('aging'), AGING_DICT),
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
      accessorKey: 'black',
      accessorFn: (row) => (row.black ? 'Black' : '__na'),
      header: ({ column }) => <Header column={column}>Black</Header>,
      cell: ({ row }) => getBoolValue(row.getValue('black')),
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
      accessorKey: 'overproof',
      accessorFn: (row) => (row.overproof ? 'Overproof' : '__na'),
      header: ({ column }) => (
        <Header column={column} tooltip="Overproof">
          OP
        </Header>
      ),
      cell: ({ row }) => getBoolValue(row.getValue('overproof')),
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
      accessorKey: 'origin',
      header: ({ column }) => <Header column={column}>Origin</Header>,
    },
    {
      id: 'actions',
      cell: ({ row }) => <ActionCell ingredientID={row.original.id} />,
      className: 'pr-1',
    },
  ]
}
