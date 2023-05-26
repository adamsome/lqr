import { CheckedState } from '@radix-ui/react-checkbox'
import { FilterFn, Row } from '@tanstack/react-table'
import { curry } from 'ramda'

export interface HierarchicalFilter {
  id: string
  checked: CheckedState
  childIDs: string[]
  children: Record<string, HierarchicalFilter>
}

export const getHierarchicalFilterItem = (
  root: HierarchicalFilter,
  path: string[]
) => path.reduce((acc, id) => acc.children[id], root)

export const updateHierarchicalFilter = curry(
  (path: string[], checked: CheckedState, root: HierarchicalFilter) => {
    setChecked(checked, getHierarchicalFilterItem(root, path))
    updateAncestors(root, path)
  }
)

export const hierarchicalFilterFn =
  <TData>(pathFn: (row: Row<TData>) => string[]): FilterFn<TData> =>
  (row, _, filterValue) => {
    if (!filterValue) return true
    const path = pathFn(row)
    const item = getHierarchicalFilterItem(filterValue, path)
    return item?.checked === true
  }

export function invertCheckedState(state: CheckedState) {
  if (state === 'indeterminate') return true
  return !state
}

function setChecked(checked: CheckedState, item?: HierarchicalFilter) {
  if (!item) return
  item.checked = checked
  item.childIDs.forEach((id) => setChecked(checked, item.children[id]))
}

function updateAncestors(root: HierarchicalFilter, path: string[]): void {
  if (path.length === 0) return
  const parentPath = path.slice(0, path.length - 1)
  const item = getHierarchicalFilterItem(root, parentPath)
  const checked = item.children[item.childIDs[0]].checked
  if (checked === 'indeterminate') {
    item.checked = 'indeterminate'
    return updateAncestors(root, parentPath)
  }
  for (let i = 1; i < item.childIDs.length; i++) {
    const child = item.children[item.childIDs[i]]
    if (child.checked !== checked) {
      item.checked = 'indeterminate'
      return updateAncestors(root, parentPath)
    }
  }
  item.checked = checked
  return updateAncestors(root, parentPath)
}
