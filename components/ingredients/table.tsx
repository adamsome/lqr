'use client'

import { useData } from '@/components/data-provider'
import { createColumns } from '@/components/ingredients/columns'
import { Toolbar } from '@/components/ingredients/toolbar'
import { DataTableContainer } from '@/components/ui/data-table-container'
import { Ingredient } from '@/lib/types'

type Props = {
  data: Ingredient[]
}

export function Table({ data }: Props) {
  const { baseIngredientDict } = useData()
  return (
    <DataTableContainer
      columns={createColumns(baseIngredientDict)}
      data={data}
      Toolbar={Toolbar}
    />
  )
}
