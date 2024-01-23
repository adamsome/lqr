import { useIsMounted } from '@/app/components/ui/use-is-mounted'
import { Column } from '@tanstack/react-table'
import { useMemo } from 'react'

export function useDataTableFacets(
  column?: Column<any, unknown>,
  transformFacetsFn?: (facets: Map<any, number>) => Map<any, number>,
) {
  const mounted = useIsMounted()

  const getFacetedUniqueValues = useMemo(
    () => (mounted ? column?.getFacetedUniqueValues : undefined),
    [mounted, column],
  )

  const rawFacets = getFacetedUniqueValues?.()
  const facets = useMemo(() => {
    if (!mounted || !rawFacets || !transformFacetsFn) return rawFacets
    return transformFacetsFn(rawFacets)
  }, [mounted, rawFacets, transformFacetsFn])

  return facets
}

export function useDataTableMultiFacets(
  columns?: (Column<any, unknown> | undefined)[],
  transformFacetsFnPerColumn?: (
    | ((facets: Map<any, number>) => Map<any, number>)
    | undefined
  )[],
) {
  const mounted = useIsMounted()

  const getFacetedUniqueValuesPerColumn = useMemo(
    () =>
      mounted ? columns?.map((c) => c?.getFacetedUniqueValues) : undefined,
    [mounted, columns],
  )

  const rawPerColumn = (columns ?? []).map(
    (_, i) => getFacetedUniqueValuesPerColumn?.[i]?.(),
  )

  const facetsPerColumn = useMemo(() => {
    return rawPerColumn.map((facets, i) => {
      const transform = transformFacetsFnPerColumn?.[i]
      return facets && transform ? transform(facets) : facets
    })
  }, [rawPerColumn, transformFacetsFnPerColumn])

  return facetsPerColumn
}
