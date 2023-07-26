import { KeyboardEvent, useEffect } from 'react'

import { CustomDialog } from '@/components/spec-ingredient-command/custom-dialog'
import { IngredientCommand } from '@/components/spec-ingredient-command/command'
import {
  State,
  useIngredientCommandReducer,
} from '@/components/spec-ingredient-command/reducer'
import { useKindByIngredient } from '@/components/spec-ingredient-command/use-kind-by-ingredient'
import { Button, Props as ButtonProps } from '@/components/ui/button'
import { CommandDialog } from '@/components/ui/command'
import { Amount, Ingredient, SpecIngredient } from '@/lib/types'

type Props = Omit<ButtonProps, 'onSelect'> & {
  ingredient?: SpecIngredient
  submit?: 'ingredient' | 'amount'
  openOnKey?: (e: globalThis.KeyboardEvent) => boolean
  onSelect(ingredient: SpecIngredient): void
}

export function SpecIngredientCommandDialogButton({
  children,
  ingredient,
  submit = 'amount',
  onClick,
  openOnKey,
  onSelect,
  ...props
}: Props) {
  const [kind, isSpecial] = useKindByIngredient(ingredient)
  const initialState: Partial<State> = {}
  if (kind) initialState.kind = kind
  if (ingredient) initialState.ingredient = ingredient
  if (isSpecial) initialState.special = 'allSpirits'
  if (ingredient?.name) initialState.custom = true
  const [state, dispatch] = useIngredientCommandReducer(initialState)
  const { open, custom, search, ingredient: currIngredient } = state

  useEffect(() => {
    const down = (e: globalThis.KeyboardEvent) => {
      if (openOnKey?.(e)) dispatch({ type: 'toggleOpen' })
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [openOnKey, dispatch])

  function handleDialogKey(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Escape' || (e.key === 'Backspace' && !search)) {
      e.preventDefault()
      dispatch({ type: 'back' })
    }
  }

  function handleSubmitAmount(value: Amount) {
    if (submit === 'ingredient') return
    const { quantity, unit, usage } = value
    onSelect({ ...(currIngredient ?? {}), quantity, unit, usage })
    dispatch({ type: 'reset' })
  }

  function handleSubmitIngredient(ingredient: SpecIngredient) {
    if (submit === 'amount') return
    onSelect(ingredient)
    dispatch({ type: 'reset' })
  }

  function handleSubmitCustom(name: string) {
    if (name) {
      onSelect({ name })
      dispatch({ type: 'reset' })
    } else {
      dispatch({ type: 'open' })
    }
  }

  return (
    <>
      <Button
        {...props}
        type="button"
        onClick={(e) => {
          dispatch({ type: 'toggleOpen' })
          onClick?.(e)
        }}
      >
        {children}
      </Button>
      <CustomDialog open={Boolean(custom)} onSubmit={handleSubmitCustom} />
      <CommandDialog
        open={open}
        onOpenChange={(value) => dispatch({ type: 'open', value })}
        onKeyDown={handleDialogKey}
      >
        <IngredientCommand
          state={state}
          dispatch={dispatch}
          onSubmitAmount={handleSubmitAmount}
          onSubmitIngredient={handleSubmitIngredient}
        />
      </CommandDialog>
    </>
  )
}
