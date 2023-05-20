'use client'

import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'

import { IngredientCategoryCell } from '@/components/ingredients/ingredient-category-cell'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { AgingDefs, ProductionMethodDefs } from '@/lib/consts'
import { Ingredient } from '@/lib/ingredient'

export const columns: ColumnDef<Ingredient>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column}>Name</DataTableColumnHeader>
    ),
  },
  {
    accessorKey: 'ancestors',
    // accessorFn: (row) => getIngredientAncestorText(row),
    header: ({ column }) => (
      <DataTableColumnHeader column={column}>Category</DataTableColumnHeader>
    ),
    cell: ({ row }) => <IngredientCategoryCell ingredient={row.original} />,
    filterFn: (row, columnID, value) => {
      const x = row.getValue('ancestors')
      console.log('x', x, value)
      return true
    },
  },
  {
    accessorKey: 'productionMethod',
    accessorFn: (row) =>
      row.productionMethod
        ? ProductionMethodDefs[row.productionMethod].name
        : '',
    header: ({ column }) => (
      <DataTableColumnHeader column={column}>Method</DataTableColumnHeader>
    ),
  },
  {
    accessorKey: 'aging',
    accessorFn: (row) => (row.aging ? AgingDefs[row.aging].name : ''),
    header: ({ column }) => (
      <DataTableColumnHeader column={column}>Aging</DataTableColumnHeader>
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
    cell: ({ row }) => {
      const payment = row.original
      return (
        <div className="flex w-full justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(payment.id)}
              >
                Copy payment ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View customer</DropdownMenuItem>
              <DropdownMenuItem>View payment details</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]
