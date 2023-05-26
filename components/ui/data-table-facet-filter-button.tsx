import { Column } from '@tanstack/react-table'
import { Check, LucideIcon } from 'lucide-react'
import { ReactNode, useMemo } from 'react'

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
import { cn } from '@/lib/utils'

export type DataTableFacetedFilterItem = {
  label: string
  value: string
  Icon?: LucideIcon
  icon?: ReactNode
}

interface DataTableFacetedFilter<TData, TValue> {
  column?: Column<TData, TValue>
  title?: string
  icon?: ReactNode
  items: DataTableFacetedFilterItem[]
  transformFacetsFn?: (facets: Map<any, number>) => Map<any, number>
}

export function DataTableFacetFilterButton<TData, TValue>({
  column,
  title,
  icon,
  items,
  transformFacetsFn,
}: DataTableFacetedFilter<TData, TValue>) {
  const rawFacets = column?.getFacetedUniqueValues()
  const facets = useMemo(() => {
    if (!rawFacets || !transformFacetsFn) return rawFacets
    return transformFacetsFn(rawFacets)
  }, [rawFacets, transformFacetsFn])

  const selected = new Set(column?.getFilterValue() as string[])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border">
          {icon}
          {title}
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
      key={item.value}
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
            : 'opacity-50 [&_svg]:invisible'
        )}
      >
        <Check className={cn('h-4 w-4')} />
      </div>
      {item.Icon && (
        <item.Icon className="mr-2 h-4 w-4 text-muted-foreground" />
      )}
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
