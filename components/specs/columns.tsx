'use client'

import { ColumnDef } from '@tanstack/react-table'

import { DataTableColumnHeader as Header } from '@/components/ui/data-table-column-header'
import { Spec } from '@/lib/types'

type Column<T> = ColumnDef<T> & {
  className?: string
}

export const createColumns = (): Column<Spec>[] => {
  return [
    {
      accessorKey: 'name',
      header: ({ column }) => <Header column={column}>Name</Header>,
    },
    {
      accessorKey: 'category',
      header: ({ column }) => <Header column={column}>Category</Header>,
    },
    {
      accessorKey: 'source',
      header: ({ column }) => <Header column={column}>Source</Header>,
    },
  ]
}
