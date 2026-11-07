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
    <div className="flex w-full items-end gap-1">
      <div className="flex gap-px">
        <Button
          type="button"
          className="rounded-ee-none rounded-se-none font-normal text-muted-foreground"
          variant="secondary"
          size="xs"
          disabled={index === 0}
          onClick={() => onMove(-1)}
        >
          <ArrowUpIcon />
        </Button>
        <Button
          type="button"
          className="rounded-es-none rounded-ss-none font-normal text-muted-foreground"
          variant="secondary"
          size="xs"
          disabled={index === total - 1}
          onClick={() => onMove(1)}
        >
          <ArrowDownIcon />
        </Button>
      </div>
      <div className="flex w-[calc(100%-55px)] flex-1 flex-col items-start gap-1 leading-snug">
        {category && (
          <div className="ml-1.5 w-full text-xs leading-none text-muted-foreground">
            {category}
          </div>
        )}
        <div className="flex w-full flex-1 items-center gap-1">
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
