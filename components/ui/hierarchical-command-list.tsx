import { CheckedState } from '@radix-ui/react-checkbox'
import { ReactNode } from 'react'

import { Checkbox } from '@/components/ui/checkbox'
import { CommandGroup, CommandItem } from '@/components/ui/command'
import { HierarchicalFilter } from '@/lib/hierarchical-filter'
import { cn } from '@/lib/utils'

export type SelectOptions = {
  path: string[]
  checked?: CheckedState
  bottleID?: string
}

type Props = {
  root: HierarchicalFilter
  facets?: Map<any, number>
  hasSearch?: boolean
  showCheckbox?: boolean
  showBottles?: boolean
  renderName(path: string[], full?: boolean): ReactNode
  getName(path: string[], options?: { full?: boolean }): string
  getBottleName?: (bottleID: string) => string
  onSelect(options: SelectOptions): void
}

export function HierarchicalCommandList({
  root,
  facets,
  hasSearch,
  showCheckbox,
  showBottles,
  renderName,
  getName,
  getBottleName,
  onSelect,
}: Props) {
  const { childIDs = [], children = {} } = root ?? {}
  return (
    <CommandGroup>
      {childIDs.map((id) => (
        <Item
          key={id}
          root={children[id]}
          path={[]}
          facets={facets}
          hasSearch={hasSearch}
          showCheckbox={showCheckbox}
          showBottles={showBottles}
          renderName={renderName}
          getName={getName}
          getBottleName={getBottleName}
          onSelect={onSelect}
        />
      ))}
    </CommandGroup>
  )
}

type ItemProps = Props & {
  path: string[]
}

function Item(props: ItemProps) {
  const { root, path: prevPath = [], ...rest } = props
  const { id, childIDs, children, bottleIDs } = root
  const path = [...prevPath, id]

  return (
    <>
      <ItemContent {...props} />
      {bottleIDs?.map((id) => (
        <Bottle {...rest} key={id} bottleID={id} path={path} />
      ))}
      {childIDs.map((id) => (
        <Item {...rest} key={id} root={children[id]} path={path} />
      ))}
    </>
  )
}

function ItemContent({
  path: prevPath = [],
  root,
  facets,
  hasSearch,
  showCheckbox,
  showBottles,
  renderName,
  getName,
  onSelect,
}: ItemProps) {
  const { id, checked } = root

  const count = facets?.get(id)
  if (facets !== undefined && !count) return null

  const level = prevPath.length
  const path = [...prevPath, id]

  return (
    <CommandItem
      value={getName(path, { full: true })}
      onSelect={() => onSelect({ path, checked })}
    >
      {showCheckbox && (
        <Checkbox
          className={cn('mr-2', {
            'ml-6': !hasSearch && level === 1,
            'ml-12': !hasSearch && level === 2,
            'ml-18': !hasSearch && level >= 3,
          })}
          checked={checked}
        />
      )}
      <span
        className={cn({
          'ml-6': !showCheckbox && !hasSearch && level === 1,
          'ml-12': !showCheckbox && !hasSearch && level === 2,
          'ml-18': !showCheckbox && !hasSearch && level >= 3,
        })}
      >
        {renderName(path, hasSearch)}
      </span>
      {count && (
        <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
          {count}
        </span>
      )}
    </CommandItem>
  )
}

type BottleProps = Omit<ItemProps, 'root'> & { bottleID: string }

function Bottle({
  path,
  bottleID,
  hasSearch,
  showCheckbox,
  renderName,
  getName,
  getBottleName,
  onSelect,
}: BottleProps) {
  if (!getBottleName) return null
  const level = path.length
  const name = getBottleName(bottleID)
  return (
    <CommandItem
      value={`${name} ${getName(path, { full: true })}`}
      onSelect={() => onSelect({ path, bottleID })}
    >
      <span
        className={cn('flex items-baseline gap-2', {
          'ml-6': !showCheckbox && !hasSearch && level === 1,
          'ml-12': !showCheckbox && !hasSearch && level === 2,
          'ml-18': !showCheckbox && !hasSearch && level >= 3,
        })}
      >
        {hasSearch && (
          <span className="opacity-40">{renderName(path, hasSearch)}</span>
        )}
        <span>{name}</span>
      </span>
    </CommandItem>
  )
}
