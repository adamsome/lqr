'use client'

import { createColumns } from '@/app/bar/columns'
import { Toolbar } from '@/app/bar/toolbar'
import { useData } from '@/components/data-provider'
import { DataTableContainer } from '@/components/ui/data-table-container'

export function Table() {
  const { baseIngredientDict, ingredientDict, ingredientIDs } = useData()
  const ingredients = ingredientIDs.map((id) => ingredientDict[id])
  return (
    <DataTableContainer
      columns={createColumns(baseIngredientDict)}
      data={ingredients}
      Toolbar={Toolbar}
    />
  )
}
