import { Column } from '@tanstack/react-table'
import { Check } from 'lucide-react'
import { ReactNode } from 'react'

import { Button } from '@/components/ui/button'
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
import { HierarchicalFilter } from '@/lib/hierarchical-filter'
import { cn } from '@/lib/utils'

interface DataTableFacetFilter<TData, TValue> {
  columns?: Column<TData, TValue>[]
  title?: string
  icon?: ReactNode
  root: HierarchicalFilter
  getName(path: string[]): string | undefined
}

export function DataTableHierarchicalFacetFilter<TData, TValue>({
  columns = [],
  title,
  icon,
  root,
  getName,
}: DataTableFacetFilter<TData, TValue>) {
  const facetsPerColumn = columns.map((c) => c.getFacetedUniqueValues())

  console.log('facets', facetsPerColumn)
  const selectedPerColumn = columns.map(
    (c) => new Set(c.getFilterValue() as string[])
  )

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border">
          {icon}
          {title}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-52 p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {root.childIDs.map((id) => (
                <Item
                  key={id}
                  item={root.children[id]}
                  path={[]}
                  columns={columns}
                  facetsPerColumn={facetsPerColumn}
                  selectedPerColumn={selectedPerColumn}
                  getName={getName}
                />
              ))}
            </CommandGroup>
            {selectedPerColumn.some((selected) => selected.size > 0) && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => columns[0]?.setFilterValue(undefined)}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

type ItemProps<TData, TValue> = {
  item: HierarchicalFilter
  columns: Column<any, any>[]
  facetsPerColumn: Map<any, number>[]
  selectedPerColumn: Set<string>[]
  path: string[]
  getName(path: string[]): string | undefined
}

function Item<TData, TValue>({
  item,
  columns = [],
  facetsPerColumn,
  selectedPerColumn,
  path: prevPath = [],
  getName,
}: ItemProps<TData, TValue>) {
  const { id, childIDs, children } = item
  const level = prevPath.length
  const path = [...prevPath, id]
  const [column, ...nextColumns] = columns
  const [selected, ...nextSelectedPerColumn] = selectedPerColumn
  const [facets, ...nextFacetsPerColumn] = facetsPerColumn

  const count = facets?.get(id)
  // if (!count) return null

  const isSelected = selected?.has(id)
  return (
    <>
      <CommandItem
        key={id}
        onSelect={() => {
          if (isSelected) {
            selected?.delete(id)
          } else {
            selected?.add(id)
          }
          const filterValues = Array.from(selected ?? [])
          column?.setFilterValue(filterValues.length ? filterValues : undefined)
        }}
      >
        <div
          className={cn(
            'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
            isSelected
              ? 'bg-primary text-primary-foreground'
              : 'opacity-50 [&_svg]:invisible',
            {
              'ml-6': level === 1,
              'ml-12': level === 2,
              'ml-18': level >= 3,
            }
          )}
        >
          <Check className={cn('h-4 w-4')} />
        </div>
        <span>{getName(path)}</span>
        {count && (
          <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
            {count}
          </span>
        )}
      </CommandItem>
      {childIDs.map((childID) => (
        <Item
          key={childID}
          item={children[childID]}
          path={path}
          columns={nextColumns}
          facetsPerColumn={nextFacetsPerColumn}
          selectedPerColumn={nextSelectedPerColumn}
          getName={getName}
        />
      ))}
    </>
  )
}
