import { KeyboardEvent, useEffect, useState } from 'react'

import { StockItems } from '@/components/bar-ingredient-command/stock-items'
import { Button, Props as ButtonProps } from '@/components/ui/button'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from '@/components/ui/command'
import { Ingredient } from '@/lib/types'
import { cn } from '@/lib/utils'

type Props = Omit<ButtonProps, 'onSelect'> & {
  ingredient: Ingredient
  openOnKey?: (e: globalThis.KeyboardEvent) => boolean
  onSelect?: (ingredient: Ingredient) => void
}

export function BarIngredientCommandDialogButton({
  children,
  ingredient,
  onClick,
  openOnKey,
  onSelect,
  ...props
}: Props) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const down = (e: globalThis.KeyboardEvent) => {
      if (openOnKey?.(e)) setOpen(true)
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [openOnKey, setOpen])

  function handleDialogKey(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Escape' || (e.key === 'Backspace' && !search)) {
      e.preventDefault()
      setOpen(false)
    }
  }

  return (
    <>
      <Button
        {...props}
        type="button"
        onClick={(e) => {
          setOpen(true)
          onClick?.(e)
        }}
      >
        {children}
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={(value) => setOpen(value)}
        onKeyDown={handleDialogKey}
      >
        <CommandInput
          placeholder="Type a command or search..."
          value={search}
          onValueChange={(value) => setSearch(value)}
        />
        <CommandList
          className={cn(
            '[--padding:theme(spacing.12)]',
            'max-h-[calc(100vh-var(--padding)-theme(spacing.24)-3px)]'
          )}
        >
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            <StockItems
              ingredient={ingredient}
              onComplete={() => {
                setOpen(false)
                onSelect?.(ingredient)
              }}
            />
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
