import {
  CircleBackslashIcon,
  CircleIcon,
  Cross1Icon,
} from '@radix-ui/react-icons'
import { KeyboardEvent, useEffect, useState } from 'react'

import { Button, Props as ButtonProps } from '@/components/ui/button'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { NameDialog } from '@/components/ui/custom-dialog'
import { SpecIngredient } from '@/lib/types'
import { cn } from '@/lib/utils'

type Props = Omit<ButtonProps, 'onSelect'> & {
  ingredient: SpecIngredient
  openOnKey?: (e: globalThis.KeyboardEvent) => boolean
  onSelect: (ingredient: SpecIngredient) => void
  onRemove: () => void
}

export function MoreCommand({
  children,
  ingredient,
  onClick,
  openOnKey,
  onSelect,
  onRemove,
  ...props
}: Props) {
  const { infusion } = ingredient

  const [open, setOpen] = useState(false)
  const [infusionOpen, setInfusionOpen] = useState(false)
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

  function handleSetInfusion(infusion?: string) {
    onSelect({ ...ingredient, infusion })
    setInfusionOpen(false)
    setOpen(false)
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
      <NameDialog
        open={infusionOpen}
        title="Add Infusion"
        onSubmit={handleSetInfusion}
      />
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
            <CommandItem
              className="flex items-center gap-2 overflow-hidden"
              onSelect={() => onRemove()}
            >
              <Cross1Icon />
              <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                Remove
              </span>
            </CommandItem>
            <CommandItem
              className="flex items-center gap-2 overflow-hidden"
              onSelect={() =>
                infusion ? handleSetInfusion() : setInfusionOpen(true)
              }
            >
              {infusion ? <CircleBackslashIcon /> : <CircleIcon />}
              <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                {infusion ? 'Remove' : 'Add'} Infusion
              </span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
