'use client'

import { createColumns } from '@/app/research/columns'
import { Toolbar } from '@/app/research/toolbar'
import { useData } from '@/components/data-provider'
import { DataTable } from '@/components/ui/data-table'
import { DataTableContainer } from '@/components/ui/data-table-container'
import { DataTablePagination } from '@/components/ui/data-table-pagination'

export function Table() {
  const { baseIngredientDict, ingredientDict, ingredientIDs } = useData()
  const ingredients = ingredientIDs.map((id) => ingredientDict[id])
  return (
    <DataTableContainer
      columns={createColumns(baseIngredientDict)}
      data={ingredients}
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
