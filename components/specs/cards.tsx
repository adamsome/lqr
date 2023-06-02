'use client'

import { ColumnDef, Table as TableType } from '@tanstack/react-table'

import { Card } from '@/components/specs/card'
import { DataTablePagination } from '@/components/ui/data-table-pagination'
import { TableCell, TableRow } from '@/components/ui/table'
import { Spec } from '@/lib/types'

type Props = {
  table: TableType<Spec>
  columns: ColumnDef<Spec, unknown>[]
}

export function Cards({ table, columns }: Props) {
  const rows = table.getRowModel().rows
  if (!rows.length) {
    return <Empty columnCount={columns.length} />
  }
  return (
    <>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(theme(spacing.64),1fr))] gap-4 lg:gap-6">
        {rows.map((row) => (
          <Card key={row.id} spec={row.original} />
        ))}
      </div>
      <DataTablePagination table={table} />
    </>
  )
}

function Empty({ columnCount }: { columnCount: number }) {
  return (
    <TableRow>
      <TableCell colSpan={columnCount} className="h-24 text-center">
        No results.
      </TableCell>
    </TableRow>
  )
}
