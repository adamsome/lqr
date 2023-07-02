'use client'

import { Plus } from 'lucide-react'

import {
  Props as AddButtonProps,
  BarAddIngredientCommandDialogButton,
} from '@/components/bar-add-ingredient-command/command-dialog-button'
import { BarIngredientCommandDialogButton } from '@/components/bar-ingredient-command/command-dialog-button'
import { StockIcon } from '@/components/stock-icon'
import { SelectOptions } from '@/components/ui/hierarchical-command-list'
import { useGetIngredientName } from '@/hooks/use-get-ingredient-name'
import { useMutate } from '@/hooks/use-mutate'
import { HierarchicalFilter } from '@/lib/hierarchical-filter'
import { IngredientFilter } from '@/lib/ingredient/filter-ingredient-items'
import { getStockState } from '@/lib/stock'
import { Ingredient } from '@/lib/types'
import { cn } from '@/lib/utils'
import invariant from 'tiny-invariant'

export type BarCategory = IngredientFilter & {
  stocked: Ingredient[]
  topItems?: Ingredient[]
  root?: HierarchicalFilter
  rowSpan?: number
}

type Props = {
  className?: string
  category: BarCategory
  muteItems?: boolean
}

export function Category({ className, category, muteItems }: Props) {
  const { name, stocked, topItems, root, rowSpan = 1 } = category

  const [mutating, mutate] = useMutate('/api/stock')
  const getIngredientName = useGetIngredientName()

  function onSelect({ item, id, path }: SelectOptions) {
    const ingredientID = item ? item.id : id ?? path?.[path.length - 1]
    invariant(ingredientID, `ID required to add an ingredient.`)
    mutate({ method: 'PUT', body: JSON.stringify({ ingredientID, stock: 1 }) })
  }

  const addProps = { topItems, root, muteItems, mutating, onSelect }

  return (
    <div
      className={cn('flex flex-col gap-2', className, {
        'row-span-1': rowSpan === 1,
        'row-span-2': rowSpan === 2,
        'row-span-3': rowSpan === 3,
      })}
    >
      <div className="flex items-center justify-between border-b pb-1 font-semibold">
        {name ?? 'Unknown Category'}
        <AddButton
          className="px-1 text-muted-foreground"
          variant="ghost"
          size="xs"
          {...addProps}
        >
          <Plus size={16} />
        </AddButton>
      </div>
      <div className="flex flex-col flex-wrap items-start gap-2">
        {stocked.map((it) => (
          <BarIngredientCommandDialogButton
            key={it.id}
            className="flex max-w-full items-center gap-2 overflow-hidden"
            variant="secondary"
            ingredient={it}
          >
            <div className="scale-[.8] transform opacity-60">
              <StockIcon stock={getStockState(it.stock)} />
            </div>
            <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
              {getIngredientName(it, { inclBottle: true })}
            </span>
          </BarIngredientCommandDialogButton>
        ))}
        {stocked.length === 0 && (
          <AddButton
            className="gap-1 border-dashed pl-3 text-muted-foreground"
            variant="outline"
            {...addProps}
          >
            <Plus size={16} />
            Add Bottle
          </AddButton>
        )}
      </div>
    </div>
  )
}

function AddButton({ children, ...props }: AddButtonProps) {
  return (
    <BarAddIngredientCommandDialogButton {...props}>
      {children}
    </BarAddIngredientCommandDialogButton>
  )
}
