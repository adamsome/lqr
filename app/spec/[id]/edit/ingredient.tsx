import { IngredientSelect } from '@/app/spec/[id]/edit/ingredient-select'
import { useData } from '@/components/data-provider'
import { Button } from '@/components/ui/button'
import { useGetIngredientName } from '@/hooks/use-get-ingredient-name'
import { getSpecAmountName } from '@/lib/ingredient/get-amount-name'
import { SpecIngredient } from '@/lib/types'
import { capitalize } from '@/lib/utils'
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
  const { ingredientDict } = useData()
  const getIngredientName = useGetIngredientName()

  const amount = getSpecAmountName(ingredient)

  let category = ''
  let name = getIngredientName(ingredient).toLocaleLowerCase()
  if (!amount[0]) name = capitalize(name)

  const { bottleID } = ingredient
  if (bottleID) {
    category = capitalize(name)
    name = ingredientDict[bottleID].name
  }

  return (
    <div className="flex items-end gap-1">
      <div className="flex gap-px">
        <Button
          className="rounded-ee-none rounded-se-none text-muted-foreground"
          variant="secondary"
          size="xs"
          disabled={index === 0}
          onClick={() => onMove(-1)}
        >
          <ArrowUp size={12} />
        </Button>
        <Button
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
        <IngredientSelect variant="secondary" size="xs" onSelect={onUpdate}>
          <div className="flex items-baseline gap-1.5">
            {amount[0] && <span>{amount[0]}</span>}
            <span>{name}</span>
            {amount[1] && <span>{amount[1]}</span>}
          </div>
        </IngredientSelect>
      </div>
      <Button className="text-muted-foreground" variant="secondary" size="xs">
        <X size={12} onClick={onRemove} />
      </Button>
    </div>
  )
}
