import { Table } from '@tanstack/react-table'
import { useEffect, useState } from 'react'

export function useIsDataTableFiltered<T>(table: Table<T>) {
  const [isFiltered, setIsFiltered] = useState(false)
  useEffect(() => {
    let mounted = true
    function initIsFiltered() {
      if (!mounted) return
      setIsFiltered(
        table.getPreFilteredRowModel().rows.length >
          table.getFilteredRowModel().rows.length
      )
    }
    initIsFiltered()
    return () => {
      mounted = false
    }
  }, [table])
  return isFiltered
}
