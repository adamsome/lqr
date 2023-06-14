'use client'

import { KeyboardEvent, useEffect, useState } from 'react'

import { AmountItems } from '@/components/ingredient-command/amount-items'
import { IngredientItems } from '@/components/ingredient-command/ingredient-items'
import { RumItems } from '@/components/ingredient-command/rum-items'
import { SpiritItems } from '@/components/ingredient-command/spirit-items'
import { useIngredientsByKind } from '@/components/ingredient-command/use-ingredients-by-kind'
import { Button, Props as ButtonProps } from '@/components/ui/button'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { INGREDIENT_KINDS, IngredientKind } from '@/lib/ingredient/kind'
import { Amount, SpecIngredient } from '@/lib/types'
import { cn } from '@/lib/utils'

type Special = 'allSpirits' | 'rum'

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
  const byKind = useIngredientsByKind()

  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [kind, setKind] = useState<IngredientKind | undefined>(undefined)
  const [ingredient, setIngredient] = useState<SpecIngredient | undefined>(
    undefined
  )
  const [showSpecial, setShowSpecial] = useState<Special | undefined>(undefined)

  useEffect(() => {
    const down = (e: globalThis.KeyboardEvent) => {
      if (openOnKey?.(e)) setOpen((open) => !open)
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [openOnKey])

  function handleClose() {
    setIngredient(undefined)
    setKind(undefined)
    setShowSpecial(undefined)
    setSearch('')
    setOpen(false)
  }

  function handleSelectKind(value: IngredientKind) {
    setKind(value)
    setSearch('')
  }

  function handleDialogKey(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Escape' || (e.key === 'Backspace' && !search)) {
      e.preventDefault()
      setSearch('')
      if (ingredient) {
        setIngredient(undefined)
      } else if (kind) {
        if (showSpecial) {
          setShowSpecial(undefined)
        } else {
          setKind(undefined)
        }
      } else {
        handleClose()
      }
    }
  }

  function handleSelectAllSpirits() {
    setSearch('')
    setShowSpecial('allSpirits')
  }

  function handleSelectIngredient(it: SpecIngredient) {
    setSearch('')
    if (showSpecial !== 'rum' && it.id === 'cane_rum') {
      return setShowSpecial('rum')
    }
    setIngredient(it)
  }

  function handleSelectAmount(value: Amount) {
    const { quantity, unit, usage } = value
    onSelect({ ...(ingredient ?? {}), quantity, unit, usage })
    handleClose()
  }

  return (
    <>
      <Button
        {...props}
        onClick={(e) => {
          setOpen(!open)
          onClick?.(e)
        }}
      >
        {children}
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        onKeyDown={handleDialogKey}
      >
        <CommandInput
          placeholder="Type a command or search..."
          value={search}
          onValueChange={setSearch}
        />
        <CommandList
          className={cn(
            '[--padding:theme(spacing.12)]',
            'max-h-[calc(100vh-var(--padding)-theme(spacing.12)-3px)]'
          )}
        >
          <CommandEmpty>No results found.</CommandEmpty>
          <Items
            kind={kind}
            special={showSpecial}
            ingredient={ingredient}
            ingredients={kind ? byKind[kind] : []}
            hasSearch={Boolean(search)}
            onSelect={handleSelectIngredient}
            onSelectKind={handleSelectKind}
            onSelectAmount={handleSelectAmount}
            onSelectAllSpirits={handleSelectAllSpirits}
          />
        </CommandList>
      </CommandDialog>
    </>
  )
}

type KindItemProps = {
  kind?: IngredientKind
  ingredient?: SpecIngredient
  special?: Special
  ingredients: SpecIngredient[]
  hasSearch?: boolean
  onSelect(ingredient: SpecIngredient): void
  onSelectKind(value: IngredientKind): void
  onSelectAmount(value: Amount): void
  onSelectAllSpirits(): void
}

function Items({
  kind,
  special,
  ingredient,
  ingredients,
  hasSearch,
  onSelect,
  onSelectKind,
  onSelectAmount,
  onSelectAllSpirits,
}: KindItemProps) {
  if (!kind) {
    return (
      <CommandGroup>
        {INGREDIENT_KINDS.map(({ value, label }) => (
          <CommandItem key={value} onSelect={() => onSelectKind(value)}>
            {label}
          </CommandItem>
        ))}
      </CommandGroup>
    )
  }
  if (ingredient) {
    return (
      <AmountItems
        kind={kind}
        ingredient={ingredient}
        onSelect={onSelectAmount}
      />
    )
  }
  if (special === 'allSpirits') {
    return <SpiritItems hasSearch={hasSearch} onSelect={onSelect} />
  }
  if (special === 'rum') {
    return <RumItems onSelect={onSelect} />
  }
  return (
    <>
      {kind === 'spirit' && (
        <>
          <CommandGroup>
            <CommandItem onSelect={onSelectAllSpirits}>All Spirits</CommandItem>
          </CommandGroup>
          <CommandSeparator className="mb-1" />
        </>
      )}
      <IngredientItems ingredients={ingredients} onSelect={onSelect} />
    </>
  )
}
