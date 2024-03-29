import { CheckedState } from '@radix-ui/react-checkbox'
import { Fragment, ReactNode } from 'react'

import { Checkbox } from '@/app/components/ui/checkbox'
import {
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from '@/app/components/ui/command'
import { HierarchicalFilter } from '@/app/lib/hierarchical-filter'
import { HasIDAndName, IngredientSpecifier } from '@/app/lib/types'
import { cn } from '@/app/lib/utils'

export type SelectOptions<T extends HasIDAndName = HasIDAndName> =
  IngredientSpecifier<T> & {
    checked?: CheckedState
  }

type Props<T extends HasIDAndName> = {
  topItems?: T[]
  root: HierarchicalFilter
  facets?: Map<any, number>
  disabledIDs?: Set<string>
  hasSearch?: boolean
  showCheckbox?: boolean
  showBottles?: boolean
  groupTrunks?: boolean
  muteItems?: boolean
  rejectCheckedLeaves?: boolean
  renderName(specifier: IngredientSpecifier<T>): ReactNode
  getIngredientPathName(path: string[]): string
  onSelect(options: SelectOptions): void
}

export function HierarchicalCommandList<T extends HasIDAndName>({
  root,
  topItems,
  ...props
}: Props<T>) {
  const { groupTrunks } = props
  const { childIDs = [], children = {} } = root ?? {}

  const top = topItems?.length ? (
    <>
      <CommandGroup>
        {topItems.map((it) => (
          <TopItem key={it.id} {...props} item={it} />
        ))}
      </CommandGroup>
      <CommandSeparator />
    </>
  ) : null

  if (groupTrunks) {
    const { renderName } = props
    return (
      <>
        {top}
        {childIDs.map((groupID, i) => (
          <Fragment key={groupID}>
            {i > 0 && <CommandSeparator />}
            <CommandGroup
              className="[&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:opacity-75"
              heading={renderName({ id: groupID })}
            >
              {children[groupID].childIDs.map((id) => {
                const child = children[groupID].children[id]
                if (props.rejectCheckedLeaves && children[groupID]?.checked)
                  return null
                const path = [groupID]
                return <Item key={id} root={child} path={path} {...props} />
              })}
            </CommandGroup>
          </Fragment>
        ))}
      </>
    )
  }
  return (
    <>
      {top}
      <CommandGroup>
        {childIDs.map((id) => (
          <Item key={id} root={children[id]} path={[]} {...props} />
        ))}
      </CommandGroup>
    </>
  )
}

type ItemProps<T extends HasIDAndName> = Props<T> & {
  path: string[]
  showSeparator?: boolean
}

function Item<T extends HasIDAndName>(props: ItemProps<T>) {
  const { root, path: prevPath = [], ...rest } = props
  const { id, childIDs, children, bottleIDs, checked } = root
  if (
    rest.rejectCheckedLeaves &&
    checked &&
    !bottleIDs?.length &&
    !childIDs?.length
  )
    return null

  const path = [...prevPath, id]

  return (
    <>
      <ItemContent
        {...props}
        showSeparator={
          rest.showBottles &&
          rest.muteItems &&
          ((bottleIDs?.length ?? 0) > 0 || childIDs.length > 0)
        }
      />
      {rest.showBottles &&
        bottleIDs?.map((id) => (
          <Bottle {...rest} key={id} bottleID={id} path={path} />
        ))}
      {childIDs.map((id) => (
        <Item {...rest} key={id} root={children[id]} path={path} />
      ))}
    </>
  )
}

function TopItem<T extends HasIDAndName>({
  item,
  facets,
  disabledIDs,
  showCheckbox,
  renderName,
  onSelect,
}: Omit<Props<T>, 'root'> & { item: T }) {
  const { id, name } = item
  const count = facets?.get(id)
  if (facets !== undefined && !count) return null

  return (
    <CommandItem
      value={name}
      disabled={disabledIDs?.has(id)}
      onSelect={() => onSelect({ item })}
    >
      {showCheckbox && <Checkbox className={cn('mr-2')} />}
      <span>{renderName({ item })}</span>
      {count && (
        <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
          {count}
        </span>
      )}
    </CommandItem>
  )
}

function ItemContent<T extends HasIDAndName>({
  path: prevPath = [],
  root,
  facets,
  disabledIDs,
  hasSearch,
  showCheckbox,
  groupTrunks,
  muteItems,
  showSeparator,
  renderName,
  getIngredientPathName,
  onSelect,
}: ItemProps<T>) {
  const { id, checked } = root

  const count = facets?.get(id)
  if (facets !== undefined && !count) return null

  let level = prevPath.length
  if (groupTrunks) level--

  const path = [...prevPath, id]

  return (
    <>
      <CommandItem
        className={cn(muteItems && 'mt-2.5 !py-0.5')}
        value={getIngredientPathName(path)}
        disabled={disabledIDs?.has(id)}
        onSelect={() => onSelect({ path, checked })}
      >
        {showCheckbox && (
          <Checkbox
            className={cn(
              !hasSearch && level === 1 && 'ml-6',
              !hasSearch && level === 2 && 'ml-12',
              !hasSearch && level >= 3 && 'ml-18',
            )}
            checked={checked}
          />
        )}
        <span
          className={cn(
            muteItems && 'text-muted-foreground font-semibold',
            !showCheckbox && !hasSearch && level === 1 && 'ml-6',
            !showCheckbox && !hasSearch && level === 2 && 'ml-12',
            !showCheckbox && !hasSearch && level >= 3 && 'ml-18',
          )}
        >
          {hasSearch ? renderName({ path }) : renderName({ id })}
        </span>
        {count && (
          <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
            {count}
          </span>
        )}
      </CommandItem>
      {showSeparator && (
        <CommandSeparator
          className={cn(
            'mr-2 bg-border/60',
            !hasSearch && level === 0 && 'ml-2',
            !hasSearch && level === 1 && 'ml-8',
            !hasSearch && level === 2 && 'ml-14',
            !hasSearch && level >= 3 && 'ml-20',
          )}
        />
      )}
    </>
  )
}

type BottleProps<T extends HasIDAndName> = Omit<ItemProps<T>, 'root'> & {
  bottleID: string
}

function Bottle<T extends HasIDAndName>({
  path,
  bottleID,
  disabledIDs,
  hasSearch,
  showCheckbox,
  groupTrunks,
  renderName,
  getIngredientPathName,
  onSelect,
}: BottleProps<T>) {
  let level = path.length - 1
  if (groupTrunks) level--

  const name = renderName({ id: bottleID })
  return (
    <CommandItem
      value={`${name} ${getIngredientPathName(path)}`}
      disabled={disabledIDs?.has(bottleID)}
      onSelect={() => onSelect({ path, id: bottleID })}
    >
      <span
        className={cn(
          'flex items-baseline gap-2',
          !showCheckbox && !hasSearch && level === 1 && 'ml-6',
          !showCheckbox && !hasSearch && level === 2 && 'ml-12',
          !showCheckbox && !hasSearch && level >= 3 && 'ml-18',
        )}
      >
        {hasSearch && (
          <span className="opacity-40">{renderName({ path })}</span>
        )}
        <span>{name}</span>
      </span>
    </CommandItem>
  )
}
