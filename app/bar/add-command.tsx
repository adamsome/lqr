'use client'

import { ReactNode } from 'react'
import invariant from 'tiny-invariant'

import { SpecIngredientCommandDialogButton } from '@/components/spec-ingredient-command/command-dialog-button'
import { Props as ButtonProps } from '@/components/ui/button'
import { useMutate } from '@/hooks/use-mutate'
import { SpecIngredient } from '@/lib/types'

type Props = Omit<ButtonProps, 'children'> & {
  children?: ReactNode
  stocked?: Set<string>
}

export function AddCommand({ children, stocked, ...props }: Props) {
  const { mutating, mutate } = useMutate('/api/stock')

  function handleSelect({ id, bottleID }: SpecIngredient) {
    const ingredientID = bottleID ?? id
    invariant(ingredientID, 'ID required to add an ingredient')
    mutate({ method: 'PUT', body: JSON.stringify({ ingredientID, stock: 1 }) })
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
