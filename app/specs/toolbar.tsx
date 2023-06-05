'use client'

import { X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { DataTableColumnFilterInput } from '@/components/ui/data-table-column-filter-input'
import { DataTableToolbarProps } from '@/components/ui/data-table-container'
import {
  DataTableFacetFilterButton,
  DataTableFacetedFilterItem,
} from '@/components/ui/data-table-facet-filter-button'
import { DataTableViewOptions } from '@/components/ui/data-table-view-options'
import { useIsDataTableFiltered } from '@/hooks/use-is-data-table-filtered'
import { Spec } from '@/lib/types'

const CATEGORY_ITEMS: DataTableFacetedFilterItem[] = [
  { label: 'Tiki', value: 'tiki' },
  { label: 'Highball', value: 'highball' },
  { label: 'Daiquiri', value: 'daiquiri' },
]

type Props = DataTableToolbarProps<Spec>

export function Toolbar({ table }: Props) {
  const isFiltered = useIsDataTableFiltered(table)

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center gap-2">
        <DataTableColumnFilterInput
          id="name"
          placeholder="Filter Names..."
          table={table}
        />
        {table.getColumn('category') && (
          <DataTableFacetFilterButton
            column={table.getColumn('category')}
            title="Category"
            items={CATEGORY_ITEMS}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
