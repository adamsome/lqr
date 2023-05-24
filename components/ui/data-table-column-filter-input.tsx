import { Table } from '@tanstack/react-table'

import { Ingredient } from '@/lib/types'
import { DataTableViewOptions } from '@/components/ui/data-table-view-options'
import { Input } from '@/components/ui/input'

type Props<T, K extends keyof T & string> = {
  id: K
  table: Table<T>
  placeholder?: string
}

export function DataTableColumnFilterInput<T, K extends keyof T & string>({
  id,
  table,
  placeholder = 'Filter...',
}: Props<T, K>) {
  return (
    <Input
      placeholder={placeholder}
      value={(table.getColumn(id)?.getFilterValue() as string) ?? ''}
      onChange={(event) =>
        table.getColumn(id)?.setFilterValue(event.target.value)
      }
      className="h-8 w-36 lg:w-60"
    />
  )
}
