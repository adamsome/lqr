'use client'

import { BarIngredientCommandDialogButton } from '@/components/bar-ingredient-command/command-dialog-button'
import { StockIcon } from '@/components/stock-icon'
import { Button } from '@/components/ui/button'
import { getStockState } from '@/lib/stock'
import { IngredientDef } from '@/lib/types'
import { cn } from '@/lib/utils'
import { MoreVertical, Plus } from 'lucide-react'

export type BarCategory = {
  ingredients: IngredientDef[]
  name?: string
  rowSpan?: number
}

type Props = {
  className?: string
  category: BarCategory
}

export function Category({ className, category }: Props) {
  const { name, ingredients, rowSpan = 1 } = category
  return (
    <div
      className={cn('rowsp flex flex-col gap-2', className, {
        'row-span-1': rowSpan === 1,
        'row-span-2': rowSpan === 2,
        'row-span-3': rowSpan === 3,
      })}
    >
      <div className="flex items-center justify-between border-b pb-1 font-semibold">
        {name ?? 'Unknown Category'}
        <Button
          className="px-1 text-muted-foreground"
          variant="ghost"
          size="xs"
        >
          <Plus size={16} />
        </Button>
      </div>
      <div className="flex flex-col flex-wrap items-start gap-2">
        {ingredients.map((it) => (
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
        {ingredients.length === 0 && (
          <Button
            className="gap-1 border-dashed pl-3 text-muted-foreground"
            variant="outline"
          >
            <Plus size={16} />
            Add Bottle
          </Button>
        )}
      </div>
    </div>
  )
}
