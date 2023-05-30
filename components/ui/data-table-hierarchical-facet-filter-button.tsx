import { CheckedState } from '@radix-ui/react-checkbox'
import { Column } from '@tanstack/react-table'
import { produce } from 'immer'
import { ReactNode, useMemo, useState } from 'react'

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
  getHierarchicalSelectedPaths,
  invertCheckedState,
  updateHierarchicalFilter,
} from '@/lib/hierarchical-filter'
import { cn } from '@/lib/utils'
import { useCommandState } from 'cmdk'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'

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

  const filterValue = column?.getFilterValue() as HierarchicalFilter
  const selected = filterValue ?? root

  const rawFacets = column?.getFacetedUniqueValues()
  const facets = useMemo(() => {
    if (!rawFacets || !transformFacetsFn) return rawFacets
    return transformFacetsFn(rawFacets)
  }, [rawFacets, transformFacetsFn])

  const { checked, childIDs, children } = selected

  const selectedPaths = useMemo(() => {
    return getHierarchicalSelectedPaths(selected, { facets })
  }, [selected, facets])

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
                  search={search}
                  renderName={renderName}
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

type ItemProps = {
  item: HierarchicalFilter
  path: string[]
  search: string
  facets?: Map<any, number>
  renderName(path: string[], full?: boolean): ReactNode
  getName(path: string[], options?: { full?: boolean }): string
  onSelect(path: string[], state: CheckedState): void
}

function Item(props: ItemProps) {
  const { item, path: prevPath = [], ...rest } = props
  const { id, childIDs, children } = item
  const path = [...prevPath, id]

  return (
    <>
      <ItemContent {...props} />
      {childIDs.map((childID) => (
        <Item {...rest} key={childID} item={children[childID]} path={path} />
      ))}
    </>
  )
}

function ItemContent({
  item,
  path: prevPath = [],
  search,
  facets,
  renderName,
  getName,
  onSelect,
}: ItemProps) {
  const { id, checked } = item

  const count = facets?.get(id)
  if (!count) return null

  const level = prevPath.length
  const path = [...prevPath, id]

  return (
    <CommandItem
      value={getName(path, { full: true })}
      onSelect={() => onSelect(path, checked)}
    >
      <Checkbox
        className={cn('mr-2', {
          'ml-6': !search && level === 1,
          'ml-12': !search && level === 2,
          'ml-18': !search && level >= 3,
        })}
        checked={checked}
      />
      <span>{renderName(path, Boolean(search))}</span>
      {count && (
        <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
          {count}
        </span>
      )}
    </CommandItem>
  )
}
