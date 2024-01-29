import { CheckIcon } from '@radix-ui/react-icons'
import { Column } from '@tanstack/react-table'
import { Fragment, ReactNode } from 'react'

import { Level } from '@/app/components/layout/level'
import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/app/components/ui/command'
import { DataTableFacetedFilterItem } from '@/app/components/ui/data-table-facet-filter-button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/app/components/ui/popover'
import { Separator } from '@/app/components/ui/separator'
import { useDataTableMultiFacets } from '@/app/components/ui/use-data-table-facets'
import { cn } from '@/app/lib/utils'

type Props = {
  columns: (Column<any, unknown> | undefined)[]
  columnNames?: (string | undefined | null)[]
  title?: string
  icon?: ReactNode
  itemsPerColumn: DataTableFacetedFilterItem[][]
  transformFacetsFnPerColumn?: (
    | ((facets: Map<any, number>) => Map<any, number>)
    | undefined
  )[]
}

export function DataTableMultiFacetFilterButton({
  columns,
  columnNames = [],
  title,
  icon,
  itemsPerColumn,
  transformFacetsFnPerColumn,
}: Props) {
  const facetsPerColumn = useDataTableMultiFacets(
    columns,
    transformFacetsFnPerColumn,
  )

  const selectedPerColumn = columns.map(
    (c) => new Set(c?.getFilterValue() as string[]),
  )
  const selectedCount = selectedPerColumn.reduce((acc, s) => acc + s.size, 0)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border">
          {icon}
          {title}
          {selectedCount > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedCount}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedCount > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedCount} selected
                  </Badge>
                ) : (
                  itemsPerColumn.map((items, i) =>
                    items
                      .filter((item) => selectedPerColumn[i]?.has(item.value))
                      .map((item) => (
                        <Badge
                          variant="secondary"
                          key={`${i}_${item.value}`}
                          className="rounded-sm px-1 font-normal"
                        >
                          {item.label}
                        </Badge>
                      )),
                  )
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-52 p-0" align="start">
        <Command className="relative">
          <CommandInput placeholder={title} />
          <CommandList
            className={cn(
              '[--padding:theme(spacing.4)] lg:[--padding:theme(spacing.8)]',
              'max-h-[calc(var(--radix-popover-content-available-height)-var(--padding)-theme(spacing.11)-3px)]',
            )}
          >
            <CommandEmpty>No results found.</CommandEmpty>
            {itemsPerColumn.map((items, i) => (
              <Fragment key={i}>
                {i !== 0 && <CommandSeparator />}
                <CommandGroup heading={columnNames[i]}>
                  {items.map((item) => (
                    <Item
                      key={item.value}
                      item={item}
                      column={columns[i]}
                      columnName={columnNames[i]}
                      selected={selectedPerColumn[i]}
                      facets={facetsPerColumn[i]}
                    />
                  ))}
                </CommandGroup>
              </Fragment>
            ))}
            {selectedCount > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() =>
                      columns.forEach((c) => c?.setFilterValue(undefined))
                    }
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
  columnName?: string | null
  selected: Set<string>
  facets?: Map<any, number>
}

function Item({ item, column, columnName, selected, facets }: ItemProps) {
  const isSelected = selected.has(item.value)
  const count = facets?.get(item.value)
  if (!count) return null
  return (
    <CommandItem
      value={`${columnName ?? ''} ${item.label}`}
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
      <Level
        className={cn(
          'mr-2 h-4 w-4 rounded-sm border border-primary',
          isSelected
            ? 'bg-primary text-primary-foreground'
            : 'opacity-50 [&_svg]:invisible',
        )}
        items="center"
        justify="center"
        gap={0}
      >
        <CheckIcon />
      </Level>
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
