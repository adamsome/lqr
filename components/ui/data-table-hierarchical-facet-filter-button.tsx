import { CheckedState } from '@radix-ui/react-checkbox'
import { Column } from '@tanstack/react-table'
import { produce } from 'immer'
import { ReactNode, useMemo } from 'react'

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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  HierarchicalFilter,
  invertCheckedState,
  updateHierarchicalFilter,
} from '@/lib/hierarchical-filter'
import { cn } from '@/lib/utils'

interface DataTableFacetedFilter<TData, TValue> {
  column?: Column<TData, TValue>
  title?: string
  icon?: ReactNode
  root: HierarchicalFilter
  getName(path: string[]): string | undefined
  transformFacetsFn?: (facets: Map<any, number>) => Map<any, number>
}

// TODO: Fix search
export function DataTableHierarchicalFacetFilterButton<TData, TValue>({
  column,
  title,
  icon,
  root,
  getName,
  transformFacetsFn,
}: DataTableFacetedFilter<TData, TValue>) {
  const filterValue = column?.getFilterValue() as HierarchicalFilter
  const selected = filterValue ?? root

  const rawFacets = column?.getFacetedUniqueValues()
  const facets = useMemo(() => {
    if (!rawFacets || !transformFacetsFn) return rawFacets
    return transformFacetsFn(rawFacets)
  }, [rawFacets, transformFacetsFn])
  console.log('hfilter', facets, selected)

  const { checked, childIDs, children } = selected

  function handleSelect(path: string[], state: CheckedState) {
    let nextState: CheckedState
    if (!path.length) {
      if (state) {
        return column?.setFilterValue(undefined)
      }
      nextState = state ? false : true
    } else {
      nextState = invertCheckedState(state)
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
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          '[--padding:theme(spacing.4)] lg:[--padding:theme(spacing.8)]',
          'h-[calc(var(--radix-popover-content-available-height)-var(--padding))]',
          'w-64 p-0'
        )}
        align="start"
      >
        <Command className="relative">
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              <CommandItem onSelect={() => handleSelect([], checked)}>
                <Checkbox className="mr-2" checked={checked} />
                <span>{checked ? 'Clear All' : 'Select All'}</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              {childIDs.map((id) => (
                <Item
                  key={id}
                  item={children[id]}
                  path={[]}
                  facets={facets}
                  getName={getName}
                  onSelect={handleSelect}
                />
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

type ItemProps<TData, TValue> = {
  item: HierarchicalFilter
  path: string[]
  facets?: Map<any, number>
  getName(path: string[]): string | undefined
  onSelect(path: string[], state: CheckedState): void
}

function Item<TData, TValue>(props: ItemProps<TData, TValue>) {
  const { item, path: prevPath = [], facets, getName, onSelect } = props
  const { id, childIDs, children } = item
  const path = [...prevPath, id]

  return (
    <>
      <ItemContent {...props} />
      {childIDs.map((childID) => (
        <Item
          key={childID}
          item={children[childID]}
          path={path}
          facets={facets}
          getName={getName}
          onSelect={onSelect}
        />
      ))}
    </>
  )
}

function ItemContent<TData, TValue>({
  item,
  path: prevPath = [],
  facets,
  getName,
  onSelect,
}: ItemProps<TData, TValue>) {
  const { id, checked } = item
  const level = prevPath.length
  const path = [...prevPath, id]

  const count = facets?.get(id)
  if (!count) return null

  return (
    <CommandItem key={id} onSelect={() => onSelect(path, checked)}>
      <Checkbox
        className={cn('mr-2', {
          'ml-6': level === 1,
          'ml-12': level === 2,
          'ml-18': level >= 3,
        })}
        checked={checked}
      />
      <span>{getName(path)}</span>
      {count && (
        <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
          {count}
        </span>
      )}
    </CommandItem>
  )
}
