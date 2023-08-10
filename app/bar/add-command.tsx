'use client'

import { SpecIngredientCommandDialogButton } from '@/components/spec-ingredient-command/command-dialog-button'
import { useMutate } from '@/hooks/use-mutate'
import { SpecIngredient } from '@/lib/types'
import invariant from 'tiny-invariant'

type Props = {
  stocked?: Set<string>
}

export function AddCommand({ stocked }: Props) {
  const { mutating, mutate } = useMutate('/api/stock')

  function handleSelect({ id, bottleID }: SpecIngredient) {
    const ingredientID = bottleID ?? id
    invariant(ingredientID, 'ID required to add an ingredient')
    mutate({ method: 'PUT', body: JSON.stringify({ ingredientID, stock: 1 }) })
  }

  return (
    <SpecIngredientCommandDialogButton
      submit="ingredient"
      stocked={stocked}
      disabled={mutating}
      hideCustom
      onSelect={handleSelect}
    >
      Add Ingredient
    </SpecIngredientCommandDialogButton>
  )
}
