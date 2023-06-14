import {
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from '@/components/ui/command'
import { useGetIngredientName } from '@/hooks/use-get-ingredient-name'
import { SpecIngredient } from '@/lib/types'

type Props = {
  ingredients: SpecIngredient[]
  onSelect(ingredient: SpecIngredient): void
}

export function IngredientItems({ ingredients, onSelect }: Props) {
  const getName = useGetIngredientName()
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
