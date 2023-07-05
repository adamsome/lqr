'use client'

import { createColumns } from '@/app/research/columns'
import { Toolbar } from '@/app/research/toolbar'
import { useData } from '@/components/data-provider'
import { DataTable } from '@/components/ui/data-table'
import { DataTableContainer } from '@/components/ui/data-table-container'
import { DataTablePagination } from '@/components/ui/data-table-pagination'
import { getIngredientPath } from '@/lib/ingredient/get-ingredient-path'
import { Ingredient, WithPath } from '@/lib/types'

export function Table() {
  const { ingredientDict } = useData()
  const items: WithPath<Ingredient>[] = []
  const getPath = getIngredientPath(ingredientDict)
  for (const id of Object.keys(ingredientDict)) {
    const it = ingredientDict[id]
    if (it.ordinal === undefined) continue
    const path = getPath(it.parent)
    items.push({ ...it, path })
  }
  return (
    <DataTableContainer
      columns={createColumns(ingredientDict)}
      data={items}
      render={(table, columns) => (
        <div className="flex flex-col gap-4">
          <Toolbar table={table} />
          <DataTable table={table} columns={columns} />
          <DataTablePagination table={table} />
        </div>
      )}
    />
  )
}
