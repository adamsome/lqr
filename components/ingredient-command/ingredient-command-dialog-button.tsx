import { KeyboardEvent, useEffect } from 'react'

import { CustomDialog } from '@/components/ingredient-command/custom-dialog'
import { IngredientCommand } from '@/components/ingredient-command/ingredient-command'
import { useIngredientCommandReducer } from '@/components/ingredient-command/reducer'
import { Button, Props as ButtonProps } from '@/components/ui/button'
import { CommandDialog } from '@/components/ui/command'
import { Amount, SpecIngredient } from '@/lib/types'

type Props = Omit<ButtonProps, 'onSelect'> & {
  openOnKey?: (e: globalThis.KeyboardEvent) => boolean
  onSelect(ingredient: SpecIngredient): void
}

export function IngredientCommandDialogButton({
  children,
  onClick,
  openOnKey,
  onSelect,
  ...props
}: Props) {
  const [state, dispatch] = useIngredientCommandReducer()
  const { open, custom, search, ingredient } = state

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
    const { quantity, unit, usage } = value
    onSelect({ ...(ingredient ?? {}), quantity, unit, usage })
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
          submitAmount={handleSubmitAmount}
        />
      </CommandDialog>
    </>
  )
}
