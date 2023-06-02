'use client'

import { useData } from '@/components/category-meta-provider'
import { Cards } from '@/components/specs/cards'
import { createColumns } from '@/components/specs/columns'
import { Toolbar } from '@/components/specs/toolbar'
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
