'use client'

import { Toolbar } from '@/components/ingredients/toolbar'
import { createColumns } from '@/components/specs/columns'
import { DataTable } from '@/components/ui/data-table'
import { Ingredient, Spec } from '@/lib/types'

type Props = {
  ingredients: Ingredient[]
  specs: Record<string, Spec>
}

export function Table({ specs }: Props) {
  const keys = Object.keys(specs)
  const data = keys.map((key) => specs[key])
  return <DataTable columns={createColumns()} data={data} />
}
