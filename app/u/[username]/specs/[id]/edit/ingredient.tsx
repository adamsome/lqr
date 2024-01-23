import {
  ArrowDownIcon,
  ArrowUpIcon,
  DotsHorizontalIcon,
} from '@radix-ui/react-icons'

import { MoreCommand } from '@/app/u/[username]/specs/[id]/edit/more-command'
import { useIngredientData } from '@/app/components/data-provider'
import { SpecIngredientCommandDialogButton } from '@/app/components/spec-ingredient-command/command-dialog-button'
import { Button } from '@/app/components/ui/button'
import { getIngredientView } from '@/app/lib/ingredient/get-ingredient-view'
import { SpecIngredient } from '@/app/lib/types'

type Props = {
  ingredient: SpecIngredient
  index: number
  total: number
  onUpdate(ingredient: SpecIngredient): void
  onRemove(): void
  onMove(dir: -1 | 1): void
}

export function Ingredient({
  ingredient,
  index,
  total,
  onUpdate,
  onRemove,
  onMove,
}: Props) {
  const { dict } = useIngredientData()
  const { amount, category, name, infusion } = getIngredientView(
    dict,
    ingredient,
  )
  const label = [amount[0], infusion, name, amount[1]].filter(Boolean).join(' ')
  return (
    <div className="flex items-end gap-1 w-full">
      <div className="flex gap-px">
        <Button
          type="button"
          className="rounded-ee-none rounded-se-none text-muted-foreground font-normal"
          variant="secondary"
          size="xs"
          disabled={index === 0}
          onClick={() => onMove(-1)}
        >
          <ArrowUpIcon />
        </Button>
        <Button
          type="button"
          className="rounded-es-none rounded-ss-none text-muted-foreground font-normal"
          variant="secondary"
          size="xs"
          disabled={index === total - 1}
          onClick={() => onMove(1)}
        >
          <ArrowDownIcon />
        </Button>
      </div>
      <div className="flex flex-col flex-1 items-start gap-1 w-[calc(100%-55px)] leading-snug">
        {category && (
          <div className="w-full ml-1.5 text-xs leading-none text-muted-foreground">
            {category}
          </div>
        )}
        <div className="flex-1 flex items-center gap-1 w-full">
          <SpecIngredientCommandDialogButton
            className="block justify-start overflow-hidden text-ellipsis whitespace-nowrap"
            variant="secondary"
            size="xs"
            ingredient={ingredient}
            onSelect={onUpdate}
          >
            {label}
          </SpecIngredientCommandDialogButton>
          <MoreCommand
            className="text-muted-foreground"
            variant="secondary"
            size="xs"
            ingredient={ingredient}
            onRemove={onRemove}
            onSelect={onUpdate}
          >
            <DotsHorizontalIcon />
          </MoreCommand>
        </div>
      </div>
    </div>
  )
}
