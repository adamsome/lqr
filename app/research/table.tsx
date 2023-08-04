'use client'

import { Suspense } from 'react'

import { createColumns } from '@/app/research/columns'
import { Toolbar } from '@/app/research/toolbar'
import { useIngredientData } from '@/components/data-provider'
import { DataTable } from '@/components/ui/data-table'
import { DataTableContainer } from '@/components/ui/data-table-container'
import { DataTablePagination } from '@/components/ui/data-table-pagination'
import { getIngredientPath } from '@/lib/ingredient/get-ingredient-path'
import { Ingredient, WithPath } from '@/lib/types'

export function Table() {
  const { dict } = useIngredientData()
  const items: WithPath<Ingredient>[] = []
  const getPath = getIngredientPath(dict)
  for (const id of Object.keys(dict)) {
    const it = dict[id]
    if (it.ordinal === undefined) continue
    const path = getPath(it.parent)
    items.push({ ...it, path })
  }
  return (
    <DataTableContainer
      columns={createColumns(dict)}
      data={items}
      render={(table, columns) => (
        <Suspense>
          <div className="flex flex-col gap-4">
            <Toolbar table={table} />
            <DataTable table={table} columns={columns} />
            <DataTablePagination table={table} />
          </div>
        </Suspense>
      )}
    />
  )
}
