'use client'

import { Plus } from 'lucide-react'

import {
  Props as AddButtonProps,
  BarAddIngredientCommandDialogButton,
} from '@/components/bar-add-ingredient-command/command-dialog-button'
import { BarIngredientCommandDialogButton } from '@/components/bar-ingredient-command/command-dialog-button'
import { StockIcon } from '@/components/stock-icon'
import { SelectOptions } from '@/components/ui/hierarchical-command-list'
import { useMutate } from '@/hooks/use-mutate'
import { HierarchicalFilter } from '@/lib/hierarchical-filter'
import { IngredientFilter } from '@/lib/ingredient/filter-ingredient-items'
import { getStockState } from '@/lib/stock'
import { IngredientDef } from '@/lib/types'
import { cn } from '@/lib/utils'

export type BarCategory = IngredientFilter & {
  stocked: IngredientDef[]
  root?: HierarchicalFilter
  rowSpan?: number
}

type Props = {
  className?: string
  category: BarCategory
}

export function Category({ className, category }: Props) {
  const { name, stocked, root, rowSpan = 1 } = category

  const [mutating, mutate] = useMutate('/api/stock')

  function handleSelect(selection: SelectOptions) {
    const { bottleID: ingredientID } = selection
    if (!ingredientID) {
      console.warn('Adding non-bottles not yet supported')
      return
    }
    mutate({ method: 'PUT', body: JSON.stringify({ ingredientID, stock: 1 }) })
  }

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
          root={root}
          disabled={mutating}
          onSelect={handleSelect}
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
              {it.name}
            </span>
          </BarIngredientCommandDialogButton>
        ))}
        {stocked.length === 0 && (
          <AddButton
            className="gap-1 border-dashed pl-3 text-muted-foreground"
            variant="outline"
            root={root}
            disabled={mutating}
            onSelect={handleSelect}
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
