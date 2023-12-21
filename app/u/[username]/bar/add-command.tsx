'use client'

import { ReactNode } from 'react'
import invariant from 'tiny-invariant'

import { SpecIngredientCommandDialogButton } from '@/components/spec-ingredient-command/command-dialog-button'
import { Props as ButtonProps } from '@/components/ui/button'
import { useMutateStock } from '@/lib/api/use-mutate-stock'
import { SpecIngredient } from '@/lib/types'

type Props = Omit<ButtonProps, 'children'> & {
  children?: ReactNode
  stocked?: Set<string>
}

export function AddCommand({ children, stocked, ...props }: Props) {
  const { mutating, mutate } = useMutateStock()

  function handleSelect({ id, bottleID }: SpecIngredient) {
    const ingredientID = bottleID ?? id
    invariant(ingredientID, 'ID required to add an ingredient')
    mutate(ingredientID, 1)
  }

  return (
    <SpecIngredientCommandDialogButton
      {...props}
      submit="ingredient"
      stocked={stocked}
      disabled={mutating}
      hideCustom
      onSelect={handleSelect}
    >
      {children ?? 'Add Ingredient'}
    </SpecIngredientCommandDialogButton>
  )
}
