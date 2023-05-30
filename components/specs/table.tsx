'use client'

import { Cards } from '@/components/specs/cards'
import { createColumns } from '@/components/specs/columns'
import { Toolbar } from '@/components/specs/toolbar'
import { DataTableContainer } from '@/components/ui/data-table-container'
import { Ingredient, Spec } from '@/lib/types'

type Props = {
  specs: Record<string, Spec>
}

export function Table({ specs }: Props) {
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
