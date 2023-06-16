import { useIngredientsByKind } from '@/components/ingredient-command/use-ingredients-by-kind'
import {
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from '@/components/ui/command'
import { useGetIngredientName } from '@/hooks/use-get-ingredient-name'
import { IngredientKind } from '@/lib/ingredient/kind'
import { SpecIngredient } from '@/lib/types'

type Props = {
  kind?: IngredientKind
  onSelect(ingredient: SpecIngredient): void
}

export function IngredientItems({ kind, onSelect }: Props) {
  const getName = useGetIngredientName()
  const ingredients = useIngredientsByKind(kind)
  return (
    <CommandGroup>
      {ingredients.map((it, i) => {
        const id = it.id ?? it.bottleID
        if (!id) {
          return <CommandSeparator key={`separator_${i}`} className="my-1" />
        }
        return (
          <CommandItem key={id} onSelect={() => onSelect(it)}>
            {getName(it, { inclBottle: true })}
          </CommandItem>
        )
      })}
    </CommandGroup>
  )
}
