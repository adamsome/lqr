'use client'

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  Table as TableType,
  VisibilityState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useState } from 'react'

import { DataTable } from '@/components/ui/data-table'

export type DataTableToolbarProps<TData> = {
  table: TableType<TData>
  hideColumns?: string[]
}

type Props<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  hideColumns?: string[]
  Toolbar?: (props: DataTableToolbarProps<TData>) => JSX.Element | null
  render?: (
    table: TableType<TData>,
    columns: ColumnDef<TData, TValue>[]
  ) => JSX.Element
}

export function DataTableContainer<TData, TValue>({
  columns,
  data,
  hideColumns = [],
  Toolbar,
  render,
}: Props<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    hideColumns.reduce((acc, id) => ({ ...acc, [id]: false }), {})
  )
  const [rowSelection, setRowSelection] = useState({})

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 50,
      },
    },
    enableRowSelection: true,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  return (
    <div className="flex flex-col gap-4">
      {Toolbar && <Toolbar table={table} hideColumns={hideColumns} />}
      {render && render(table, columns)}
      {!render && <DataTable table={table} columns={columns} />}
    </div>
  )
}
