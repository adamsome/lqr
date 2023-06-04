'use client'

import { Cards } from '@/app/specs/cards'
import { createColumns } from '@/app/specs/columns'
import { Toolbar } from '@/app/specs/toolbar'
import { useData } from '@/components/data-provider'
import { DataTableContainer } from '@/components/ui/data-table-container'

export function Table() {
  const { specs } = useData()
  const keys = Object.keys(specs)
  const data = keys.map((key) => specs[key])
  return (
    <DataTableContainer
      columns={createColumns()}
      data={data}
      render={(table, columns) => <Cards table={table} columns={columns} />}
      Toolbar={Toolbar}
    />
  )
}
