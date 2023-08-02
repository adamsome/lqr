import { CheckedState } from '@radix-ui/react-checkbox'
import { GearIcon } from '@radix-ui/react-icons'
import { Column } from '@tanstack/react-table'
import { produce } from 'immer'
import { ReactNode } from 'react'

import { CheckboxLabel } from '@/components/ui/checkbox-label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import {
  HierarchicalFilter,
  updateHierarchicalFilter,
} from '@/lib/hierarchical-filter'
import { cn } from '@/lib/utils'

type Props<TData> = {
  column: Column<TData, unknown>
  defaultValue: HierarchicalFilter
  renderName(path: string[], full?: boolean): ReactNode
}

export function DataTableHierarchicalFilter<TData>({
  column,
  defaultValue,
  renderName,
}: Props<TData>) {
  const value = column.getFilterValue() as HierarchicalFilter
  const filter = value ?? defaultValue

  function handleCheckedChange(path: string[], checked: CheckedState) {
    column.setFilterValue(
      path.length > 0 || !checked
        ? produce(filter, updateHierarchicalFilter(path, checked))
        : undefined
    )
  }

  return (
    <Popover modal={true}>
      <PopoverTrigger
        className={cn('m-[calc(-1*theme(spacing.1))] p-1', {
          'text-accent-foreground': value,
        })}
      >
        <GearIcon />
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          '[--padding:theme(spacing.4)] lg:[--padding:theme(spacing.8)]',
          'max-h-[calc(var(--radix-popover-content-available-height)-var(--padding))]',
          'space-y-2 overflow-auto'
        )}
      >
        <CheckboxLabel
          id="selectAll"
          checked={filter.checked}
          onCheckedChange={(checked) => handleCheckedChange([], checked)}
        >
          Select All
        </CheckboxLabel>
        <Separator />
        {filter.childIDs.map((id) => (
          <Item
            key={id}
            item={filter.children[id]}
            renderName={renderName}
            onCheckedChange={handleCheckedChange}
          />
        ))}
      </PopoverContent>
    </Popover>
  )
}

type ItemProps = {
  item: HierarchicalFilter
  path?: string[]
  renderName(path: string[], full?: boolean): ReactNode
  onCheckedChange(path: string[], checked: CheckedState): void
}

function Item({
  item,
  path: prevPath = [],
  onCheckedChange,
  renderName,
}: ItemProps) {
  const { id, checked, childIDs, children } = item
  const level = prevPath.length
  const path = [...prevPath, id]
  return (
    <>
      <div
        className={cn({
          'ml-6': level === 1,
          'ml-12': level === 2,
          'ml-18': level >= 3,
        })}
      >
        <CheckboxLabel
          id={id}
          checked={checked}
          onCheckedChange={(checked) => onCheckedChange(path, checked)}
        >
          {renderName(path)}
        </CheckboxLabel>
      </div>
      {childIDs.map((childID) => (
        <Item
          key={childID}
          item={children[childID]}
          path={path}
          renderName={renderName}
          onCheckedChange={onCheckedChange}
        />
      ))}
    </>
  )
}
