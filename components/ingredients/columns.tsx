'use client'

import { ColumnDef } from '@tanstack/react-table'

import { ActionCell } from '@/components/ingredients/action-cell'
import { CategoryCell } from '@/components/ingredients/category-cell'
import { CategoryFilter } from '@/components/ingredients/category-filter'
import { StockCell } from '@/components/ingredients/stock-cell'
import { StockIcon } from '@/components/ingredients/stock-icon'
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header'
import { AGING_DICT, PRODUCTION_METHOD_DICT } from '@/lib/consts'
import { getIngredientAncestorText } from '@/lib/get-ingredient-ancestor-text'
import { getHierarchicalFilterItem } from '@/lib/hierarchical-filter'
import { Ingredient } from '@/lib/types'

export const columns: ColumnDef<Ingredient>[] = [
  {
    accessorKey: 'stock',
    accessorFn: (row) => row.stock ?? -1,
    header: ({ column }) => (
      <DataTableColumnHeader column={column}>
        <StockIcon header />
      </DataTableColumnHeader>
    ),
    cell: ({ row }) => (
      <StockCell ingredientID={row.original.id} stock={row.getValue('stock')} />
    ),
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column}>Name</DataTableColumnHeader>
    ),
  },
  {
    accessorKey: 'ancestors',
    accessorFn: (row) => getIngredientAncestorText(row),
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        filter={<CategoryFilter column={column} />}
      >
        Category
      </DataTableColumnHeader>
    ),
    cell: ({ row }) => <CategoryCell ingredient={row.original} />,
    filterFn: (row, _, value, add) => {
      if (!value) return true
      const { ancestors, category } = row.original
      const path = [category as string].concat(ancestors.map((a) => a.id))
      const item = getHierarchicalFilterItem(value, path)
      return item?.checked === true
    },
  },
  {
    accessorKey: 'productionMethod',
    accessorFn: (row) =>
      row.productionMethod
        ? PRODUCTION_METHOD_DICT[row.productionMethod].name
        : '',
    header: ({ column }) => (
      <DataTableColumnHeader column={column}>Method</DataTableColumnHeader>
    ),
  },
  {
    accessorKey: 'aging',
    accessorFn: (row) => (row.aging ? AGING_DICT[row.aging].name : ''),
    header: ({ column }) => (
      <DataTableColumnHeader column={column}>Aging</DataTableColumnHeader>
    ),
  },
  {
    accessorKey: 'black',
    accessorFn: (row) => (row.black ? 'Black' : ''),
    header: ({ column }) => (
      <DataTableColumnHeader column={column}>Black</DataTableColumnHeader>
    ),
  },
  {
    accessorKey: 'overproof',
    accessorFn: (row) => (row.overproof ? 'OP' : ''),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Overproof">
        OP
      </DataTableColumnHeader>
    ),
  },
  {
    accessorKey: 'origin',
    header: ({ column }) => (
      <DataTableColumnHeader column={column}>Origin</DataTableColumnHeader>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => <ActionCell ingredient={row.original} />,
  },
]
