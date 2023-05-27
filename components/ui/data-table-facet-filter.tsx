import { Column, FilterFn } from '@tanstack/react-table'
import { useMemo } from 'react'

import { DataTableHierarchicalFilter } from '@/components/ui/data-table-hierarchical-filter'
import {
  HierarchicalFilter,
  hierarchicalFilterFn,
} from '@/lib/hierarchical-filter'

type Props = {
  column: Column<any, unknown>
}

const getFacetNameFromPath = (path: string[]) => {
  if (path.length === 0) return 'Select All'
  const id = path[path.length - 1]
  if (id === '__na') return 'N/A'
  return id
}

export function DataTableFacetFilter(props: Props) {
  const facets = props.column.getFacetedUniqueValues()

  const defaultValue = useMemo(() => {
    const ids = [...facets.keys()]
      .map((id) => id || '__na')
      .sort((a, b) => {
        if (a === '__na') return 1
        if (b === '__na') return -1
        return 0
      })
    return {
      id: 'all',
      checked: true,
      childIDs: ids,
      children: ids.reduce<HierarchicalFilter['children']>((acc, id) => {
        acc[id] = { id, checked: true, childIDs: [], children: {} }
        return acc
      }, {}),
    }
  }, [facets])

  return (
    <DataTableHierarchicalFilter
      {...props}
      defaultValue={defaultValue}
      renderName={getFacetNameFromPath}
    />
  )
}

export const createFacetFilterFn = (accessorKey: string): FilterFn<any> =>
  hierarchicalFilterFn((row) => [String(row.getValue(accessorKey) || '__na')])
