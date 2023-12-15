import { useMemo } from 'react'

import { useIngredientData } from '@/components/data-provider'
import {
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from '@/components/ui/command'
import { useGetIngredientName } from '@/hooks/use-get-ingredient-name'
import { HierarchicalFilter } from '@/lib/hierarchical-filter'
import { IngredientKind } from '@/lib/ingredient/kind'
import {
  KIND_INGREDIENT_DICT,
  KIND_MORE_INGREDIENT_TYPES,
} from '@/lib/ingredient/kind-ingredients'
import { SpecIngredient } from '@/lib/types'
import { rejectNil } from '@/lib/utils'

type Props = {
  kind?: IngredientKind
  stocked?: Set<string>
  onSelect(ingredient: SpecIngredient): void
}

function appendKindMoreIngredients(
  tree: HierarchicalFilter,
): Record<IngredientKind, SpecIngredient[]> {
  return KIND_MORE_INGREDIENT_TYPES.reduce(
    (acc, [kind, defs]) => {
      const ingredients = acc[kind]
      const idSet = new Set(rejectNil(ingredients.map((it) => it.id)))
      const moreIngredients = defs.flatMap(({ id, category }) => {
        const ids = tree.children[category ?? '']?.childIDs ?? []
        if (id) ids.push(id)
        return ids
          .filter((id) => !idSet.has(id))
          .map((id): SpecIngredient => ({ id }))
      })
      return { ...acc, [kind]: [...ingredients, {}, ...moreIngredients] }
    },
    { ...KIND_INGREDIENT_DICT },
  )
}

export function IngredientItems({ kind, stocked, onSelect }: Props) {
  const { tree } = useIngredientData()
  const byKind = useMemo(() => appendKindMoreIngredients(tree), [tree])
  const ingredients = useMemo(
    () => (kind ? byKind[kind] : []) ?? [],
    [byKind, kind],
  )

  const getName = useGetIngredientName()
  return (
    <CommandGroup>
      {ingredients.map((it, i) => {
        const id = it.id ?? it.bottleID
        const disabled =
          stocked?.has(it.id ?? '') || stocked?.has(it.bottleID ?? '')
        if (!id) {
          return <CommandSeparator key={`separator_${i}`} className="my-1" />
        }
        return (
          <CommandItem
            key={id}
            disabled={disabled}
            onSelect={() => !disabled && onSelect(it)}
          >
            {getName(it, { inclBottle: true })}
          </CommandItem>
        )
      })}
    </CommandGroup>
  )
}
