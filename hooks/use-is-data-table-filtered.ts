import { Table } from '@tanstack/react-table'
import { useMemo } from 'react'

import { useIsMounted } from '@/hooks/use-is-mounted'

export function useIsDataTableFiltered<T>(table: Table<T>) {
  const mounted = useIsMounted()

  const getPreFilteredRowModel = useMemo(
    () => (mounted ? table.getPreFilteredRowModel : undefined),
    [mounted, table]
  )
  const getFilteredRowModel = useMemo(
    () => (mounted ? table.getFilteredRowModel : undefined),
    [mounted, table]
  )

  return (
    (getPreFilteredRowModel?.()?.rows?.length ?? 0) >
    (getFilteredRowModel?.()?.rows?.length ?? 0)
  )
}
