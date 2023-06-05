'use client'

import { Cards } from '@/app/specs/cards'
import { createColumns } from '@/app/specs/columns'
import { Toolbar } from '@/app/specs/toolbar'
import { useData } from '@/components/data-provider'
import { DataTableContainer } from '@/components/ui/data-table-container'
import { DataTablePagination } from '@/components/ui/data-table-pagination'

export function Table() {
  const { specs } = useData()
  const keys = Object.keys(specs)
  const data = keys.map((key) => specs[key])
  return (
    <DataTableContainer
      columns={createColumns()}
      data={data}
      render={(table, columns) => (
        <div className="flex flex-col gap-4">
          <Toolbar table={table} />
          <Cards table={table} columns={columns} />
          <DataTablePagination table={table} />
        </div>
      )}
    />
  )
}
