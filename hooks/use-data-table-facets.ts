import { Column } from '@tanstack/react-table'
import { useEffect, useState } from 'react'

export function useDataTableFacets(
  column?: Column<any, unknown>,
  transformFacetsFn?: (facets: Map<any, number>) => Map<any, number>
) {
  const [facets, setFacets] = useState<Map<any, number> | undefined>(undefined)
  useEffect(() => {
    let mounted = true
    function loadFacets() {
      if (!mounted) return
      let rawFacets = column?.getFacetedUniqueValues()
      if (rawFacets && transformFacetsFn) {
        rawFacets = transformFacetsFn(rawFacets)
      }
      setFacets(rawFacets)
    }
    loadFacets()
    return () => {
      mounted = false
    }
  }, [column, transformFacetsFn])
  return facets
}

export function useDataTableMultiFacets(
  columns?: (Column<any, unknown> | undefined)[],
  transformFacetsFnPerColumn?: (
    | ((facets: Map<any, number>) => Map<any, number>)
    | undefined
  )[]
) {
  const [facetsPerColumn, setFacetsPerColumn] = useState<
    (Map<any, number> | undefined)[]
  >([])
  useEffect(() => {
    let mounted = true
    function loadFacets() {
      if (!mounted) return
      const rawPerColumn =
        (columns ?? []).map((c) => c?.getFacetedUniqueValues()) ?? []
      const facetsPerColumn = rawPerColumn.map((facets, i) => {
        const transform = transformFacetsFnPerColumn?.[i]
        return facets && transform ? transform(facets) : facets
      })
      setFacetsPerColumn(facetsPerColumn)
    }
    loadFacets()
    return () => {
      mounted = false
    }
  }, [columns, transformFacetsFnPerColumn])
  return facetsPerColumn
}
