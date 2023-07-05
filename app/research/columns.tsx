'use client'

import { ColumnDef } from '@tanstack/react-table'

import { ActionCell } from '@/app/research/action-cell'
import { StockCell } from '@/app/research/stock-cell'
import { IngredientPathText } from '@/components/ingredient-path/text'
import { StockIcon } from '@/components/stock-icon'
import { DataTableColumnHeader as Header } from '@/components/ui/data-table-column-header'
import { AGING_DICT, PRODUCTION_METHOD_DICT } from '@/lib/generated-consts'
import { hierarchicalFilterFn } from '@/lib/hierarchical-filter'
import { getIngredientPathName } from '@/lib/ingredient/get-ingredient-path-name'
import { getStockState } from '@/lib/stock'
import { Ingredient, WithPath } from '@/lib/types'
import { compareBasic, getBoolValue, getDictValue, toString } from '@/lib/utils'

type Column<T> = ColumnDef<T> & {
  className?: string
}

export const createColumns = (
  ingredientDict: Record<string, Ingredient>
): Column<WithPath<Ingredient>>[] => {
  const getPathName = getIngredientPathName(ingredientDict)
  return [
    {
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
        <StockCell
          ingredientID={row.original.id}
          stock={row.getValue('stock')}
        />
      ),
      filterFn: (row, id, value) =>
        value.includes(getStockState(row.getValue(id))),
    },
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
          toString(getPathName(bPath)).toLowerCase()
        )
      },
      header: ({ column }) => <Header column={column}>Category</Header>,
      cell: ({ row }) => <IngredientPathText path={row.original.path} />,
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
