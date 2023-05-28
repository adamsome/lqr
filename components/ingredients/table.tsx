'use client'

import { useCategoryMeta } from '@/components/category-meta-provider'
import { createColumns } from '@/components/ingredients/columns'
import { Toolbar } from '@/components/ingredients/toolbar'
import { DataTable } from '@/components/ui/data-table'
import { Ingredient } from '@/lib/types'

type Props = {
  data: Ingredient[]
}

export function Table({ data }: Props) {
  const { baseIngredientDict } = useCategoryMeta()
  return (
    <DataTable
      columns={createColumns(baseIngredientDict)}
      data={data}
      Toolbar={Toolbar}
    />
  )
}
