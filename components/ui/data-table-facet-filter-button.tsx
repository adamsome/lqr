import { CheckIcon } from '@radix-ui/react-icons'
import { Column } from '@tanstack/react-table'
import { ReactNode } from 'react'

import { Badge } from '@/components/ui/badge'
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
import { Separator } from '@/components/ui/separator'
import { useDataTableFacets } from '@/hooks/use-data-table-facets'
import { cn } from '@/lib/utils'

export type DataTableFacetedFilterItem = {
  label: string
  value: string
  icon?: ReactNode
}

type Props<TData, TValue> = {
  column?: Column<TData, TValue>
  title?: string
  icon?: ReactNode
  items: readonly DataTableFacetedFilterItem[]
  transformFacetsFn?: (facets: Map<any, number>) => Map<any, number>
}

export function DataTableFacetFilterButton<TData, TValue>({
  column,
  title,
  icon,
  items,
  transformFacetsFn,
}: Props<TData, TValue>) {
  const facets = useDataTableFacets(column, transformFacetsFn)
  const selected = new Set(column?.getFilterValue() as string[])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border">
          {icon}
          <span className="overflow-hidden overflow-ellipsis whitespace-nowrap">
            {title}
          </span>
          {selected?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selected.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selected.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selected.size} selected
                  </Badge>
                ) : (
                  items
                    .filter((item) => selected.has(item.value))
                    .map((item) => (
                      <Badge
                        variant="secondary"
                        key={item.value}
                        className="rounded-sm px-1 font-normal"
                      >
                        {item.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-52 p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <Item
                  key={item.value}
                  item={item}
                  column={column}
                  selected={selected}
                  facets={facets}
                />
              ))}
            </CommandGroup>
            {selected.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => column?.setFilterValue(undefined)}
                    className="justify-center text-center"
                  >
                    Clear All
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

type ItemProps = {
  item: DataTableFacetedFilterItem
  column?: Column<any, any>
  selected: Set<string>
  facets?: Map<any, number>
}

function Item({ item, column, selected, facets }: ItemProps) {
  const isSelected = selected.has(item.value)
  const count = facets?.get(item.value)
  if (!count) return null
  return (
    <CommandItem
      value={item.label}
      onSelect={() => {
        if (isSelected) {
          selected.delete(item.value)
        } else {
          selected.add(item.value)
        }
        const filterValues = Array.from(selected)
        column?.setFilterValue(filterValues.length ? filterValues : undefined)
      }}
    >
      <div
        className={cn(
          'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
          isSelected
            ? 'bg-primary text-primary-foreground'
            : 'opacity-50 [&_svg]:invisible',
        )}
      >
        <CheckIcon />
      </div>
      {item.icon}
      <span>{item.label}</span>
      {count && (
        <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
          {count}
        </span>
      )}
    </CommandItem>
  )
}
