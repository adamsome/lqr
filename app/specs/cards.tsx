'use client'

import { ColumnDef, Table as TableType } from '@tanstack/react-table'

import { Card } from '@/app/specs/card'
import { CardGrid } from '@/components/ui/card-grid'
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
      <CardGrid>
        {rows.map((row) => (
          <Card key={row.id} spec={row.original} />
        ))}
      </CardGrid>
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
