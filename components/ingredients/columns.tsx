'use client'

import { ColumnDef } from '@tanstack/react-table'

import { ActionCell } from '@/components/ingredients/action-cell'
import { IngredientPathCell } from '@/components/ingredients/ingredient-path-cell'
import { StockCell } from '@/components/ingredients/stock-cell'
import { StockIcon } from '@/components/ingredients/stock-icon'
import { DataTableColumnHeader as Header } from '@/components/ui/data-table-column-header'
import { AGING_DICT, PRODUCTION_METHOD_DICT } from '@/lib/consts'
import { hierarchicalFilterFn } from '@/lib/hierarchical-filter'
import { getStockState } from '@/lib/stock'
import { Ingredient, IngredientDef } from '@/lib/types'
import { useIngredientName } from '@/hooks/use-ingredient-name'
import { compareBasic, getBoolValue, getDictValue, toString } from '@/lib/utils'
import { getIngredientName } from '@/hooks/get-ingredient-name'

type Column<T> = ColumnDef<T> & {
  className?: string
}

export const createColumns = (
  baseIngredientDict: Record<string, IngredientDef>
): Column<Ingredient>[] => {
  const getName = getIngredientName(baseIngredientDict)
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
      accessorFn: (row) =>
        [row.category, ...row.ancestors.map((a) => a.id)].join('|'),
      sortingFn: (a, b, id) => {
        const aPath = (a.getValue(id) as string).split('|')
        const bPath = (b.getValue(id) as string).split('|')
        return compareBasic(
          toString(getName(aPath, { full: true })).toLowerCase(),
          toString(getName(bPath, { full: true })).toLowerCase()
        )
      },
      header: ({ column }) => <Header column={column}>Category</Header>,
      cell: ({ row }) => <IngredientPathCell ingredient={row.original} />,
      filterFn: hierarchicalFilterFn((row) => {
        const { ancestors, category } = row.original
        return [category as string].concat(ancestors.map((a) => a.id))
      }),
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
      cell: ({ row }) => <ActionCell ingredient={row.original} />,
      className: 'pr-1',
    },
  ]
}
