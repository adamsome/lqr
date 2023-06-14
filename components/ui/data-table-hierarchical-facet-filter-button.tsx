import { CheckedState } from '@radix-ui/react-checkbox'
import { Column } from '@tanstack/react-table'
import { produce } from 'immer'
import { ReactNode, useMemo, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import {
  HierarchicalCommandList,
  SelectOptions,
} from '@/components/ui/hierarchical-command-list'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { useDataTableFacets } from '@/hooks/use-data-table-facets'
import {
  HierarchicalFilter,
  getHierarchicalSelectedPaths,
  invertCheckedState,
  updateHierarchicalFilter,
} from '@/lib/hierarchical-filter'
import { cn } from '@/lib/utils'

type Props<TData, TValue> = {
  column?: Column<TData, TValue>
  title?: string
  icon?: ReactNode
  root: HierarchicalFilter
  renderName(path: string[], full?: boolean): ReactNode
  getName(path: string[], options?: { full?: boolean }): string
  transformFacetsFn?: (facets: Map<any, number>) => Map<any, number>
}

export function DataTableHierarchicalFacetFilterButton<TData, TValue>({
  column,
  title,
  icon,
  root,
  renderName,
  getName,
  transformFacetsFn,
}: Props<TData, TValue>) {
  const [search, setSearch] = useState('')
  const facets = useDataTableFacets(column, transformFacetsFn)

  const filterValue = column?.getFilterValue() as HierarchicalFilter
  const selected = filterValue ?? root

  const { checked } = selected

  const selectedPaths = useMemo(() => {
    return getHierarchicalSelectedPaths(selected, { facets })
  }, [selected, facets])

  function handleSelect({ path, checked = false }: SelectOptions) {
    let nextState: CheckedState
    if (!path.length) {
      if (checked) {
        return column?.setFilterValue(undefined)
      }
      nextState = checked ? false : true
    } else {
      nextState = invertCheckedState(checked)
    }
    const nextFilter = produce(
      selected,
      updateHierarchicalFilter(path, nextState)
    )
    column?.setFilterValue(nextFilter.checked ? nextFilter : undefined)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border">
          {icon}
          {title}
          {selectedPaths.length > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedPaths.length}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedPaths.length > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedPaths.length} selected
                  </Badge>
                ) : (
                  selectedPaths.map((path) => (
                    <Badge
                      variant="secondary"
                      key={path[path.length - 1]}
                      className="rounded-sm px-1 font-normal"
                    >
                      {renderName(path)}
                    </Badge>
                  ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <Command className="relative">
          <CommandInput
            placeholder={title}
            value={search}
            onValueChange={setSearch}
          />
          <CommandList
            className={cn(
              '[--padding:theme(spacing.4)] lg:[--padding:theme(spacing.8)]',
              'max-h-[calc(var(--radix-popover-content-available-height)-var(--padding)-theme(spacing.11)-3px)]'
            )}
          >
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              <CommandItem onSelect={() => handleSelect({ path: [], checked })}>
                <Checkbox className="mr-2" checked={checked} />
                <span>{checked ? 'Clear All' : 'Select All'}</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <HierarchicalCommandList
              root={selected}
              facets={facets}
              hasSearch={Boolean(search)}
              showCheckbox
              getName={getName}
              renderName={renderName}
              onSelect={handleSelect}
            />
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
