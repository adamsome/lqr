'use client'

import { useMemo } from 'react'

import { DestockSeparator } from '@/app/u/[username]/bar/[cabinet]/[shelf]/[category]/destock-separator'
import { Ingredient } from '@/app/u/[username]/bar/[cabinet]/[shelf]/[category]/ingredient'
import { BarCategory } from '@/app/u/[username]/bar/lib/types'
import { useIngredientData } from '@/app/components/data-provider'
import { Stack } from '@/app/components/layout/stack'
import { HierarchicalFilter } from '@/app/lib/hierarchical-filter'
import { sortByStocked } from '@/app/lib/stock'
import { Ingredient as IngredientType } from '@/app/lib/types'

type Entity = {
  ingredient?: IngredientType
  path: string[]
  generic?: boolean
  disabled?: boolean
}

type State = {
  items: Entity[]
  path: string[]
  dict: Record<string, IngredientType>
  bottlesOnly?: boolean
  genericCount: number
  stockedIDs: Set<string>
}

const initializeState = (state: Partial<State>): State => ({
  dict: {},
  items: [],
  path: [],
  bottlesOnly: false,
  genericCount: 0,
  stockedIDs: new Set(),
  ...state,
})

const flattenItemsReducer = (state: State, node: HierarchicalFilter): State => {
  const { bottlesOnly, path, dict, stockedIDs } = state
  const { id: itemID, childIDs, children, bottleIDs = [], checked } = node
  const standaloneGroup = childIDs.length > 0 && !bottleIDs?.length
  if (!standaloneGroup && !bottlesOnly) {
    const ingredient = dict[itemID]
    const disabled = checked && stockedIDs.has(itemID)
    state.items.push({ ingredient, path, generic: true, disabled })
    state.genericCount++
  }
  state.items.push(...bottleIDs.map((id) => ({ ingredient: dict[id], path })))
  const nodes = childIDs.map((id) => children[id])
  return nodes.reduce(flattenItemsReducer, state)
}

const shouldShowUnstockedItem =
  (stockedItems: IngredientType[], genericCount: number) => (it: Entity) =>
    it.ingredient &&
    (!it.generic || genericCount > 1 || stockedItems.length === 0)

type Props = {
  category?: BarCategory
  isCurrentUser?: boolean
}

export function IngredientList({ category, isCurrentUser }: Props) {
  const { name, stocked = [], topItems = [] } = category ?? {}
  const stockedItems = sortByStocked(
    stocked.filter(({ stock = -1 }) => stock >= 0),
  )
  const { dict } = useIngredientData()

  const { items, genericCount } = useMemo(() => {
    const { root, bottlesOnly, stocked = [] } = category ?? {}
    const { childIDs = [], children = {} } = root ?? {}
    const stockedIDs = new Set(stocked.map(({ id }) => id))
    const state = initializeState({ dict, bottlesOnly, stockedIDs })
    return childIDs.map((id) => children[id]).reduce(flattenItemsReducer, state)
  }, [category, dict])

  const showStockedItem = shouldShowUnstockedItem(stockedItems, genericCount)
  const unstockedItems = items.filter(showStockedItem)

  return (
    <>
      <Stack gap={0}>
        {stockedItems.map((ingredient) => (
          <Ingredient
            key={ingredient.id}
            ingredient={ingredient}
            isCurrentUser={isCurrentUser}
          />
        ))}
        {stockedItems.length === 0 && (
          <div className="pt-0.5 pb-2 text-muted-foreground/40 italic">
            {`No ${name ?? 'Unknown Ingredient'}`}
          </div>
        )}
      </Stack>
      {isCurrentUser && (
        <Stack gap={0}>
          {unstockedItems.length + topItems.length > 0 && <DestockSeparator />}
          {topItems.map((ingredient) => (
            <Ingredient
              key={ingredient.id}
              ingredient={ingredient}
              isCurrentUser
            />
          ))}
          {unstockedItems.map((it) => (
            <Ingredient key={it.ingredient!.id} {...it} isCurrentUser />
          ))}
        </Stack>
      )}
    </>
  )
}
