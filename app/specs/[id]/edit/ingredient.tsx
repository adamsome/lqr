import { IngredientCommandDialogButton } from '@/components/ingredient-command/ingredient-command-dialog-button'
import { Button } from '@/components/ui/button'
import { useIngredientName } from '@/hooks/use-ingredient-name'
import { SpecIngredient } from '@/lib/types'
import { ArrowDown, ArrowUp, X } from 'lucide-react'

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
  const { amount, category, name } = useIngredientName(ingredient)
  return (
    <div className="flex items-end gap-1">
      <div className="flex gap-px">
        <Button
          type="button"
          className="rounded-ee-none rounded-se-none text-muted-foreground"
          variant="secondary"
          size="xs"
          disabled={index === 0}
          onClick={() => onMove(-1)}
        >
          <ArrowUp size={12} />
        </Button>
        <Button
          type="button"
          className="rounded-es-none rounded-ss-none text-muted-foreground"
          variant="secondary"
          size="xs"
          disabled={index === total - 1}
          onClick={() => onMove(1)}
        >
          <ArrowDown size={12} />
        </Button>
      </div>
      <div className="flex flex-col items-start gap-1 leading-snug">
        {category && (
          <div className="ml-1.5 text-xs leading-none text-muted-foreground">
            {category}
          </div>
        )}
        <IngredientCommandDialogButton
          variant="secondary"
          size="xs"
          ingredient={ingredient}
          onSelect={onUpdate}
        >
          <div className="flex items-baseline gap-1.5">
            {amount[0] && <span>{amount[0]}</span>}
            <span>{name}</span>
            {amount[1] && <span>{amount[1]}</span>}
          </div>
        </IngredientCommandDialogButton>
      </div>
      <Button
        type="button"
        className="text-muted-foreground"
        variant="secondary"
        size="xs"
      >
        <X size={12} onClick={onRemove} />
      </Button>
    </div>
  )
}
