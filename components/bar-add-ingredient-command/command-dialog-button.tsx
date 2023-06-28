import { KeyboardEvent, useEffect, useState } from 'react'

import { useData } from '@/components/data-provider'
import { IngredientPathText } from '@/components/ingredient-path/text'
import { Button, Props as ButtonProps } from '@/components/ui/button'
import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandList,
} from '@/components/ui/command'
import {
  HierarchicalCommandList,
  SelectOptions,
} from '@/components/ui/hierarchical-command-list'
import { useGetIngredientPathName } from '@/hooks/use-get-ingredient-path-name'
import { useHierarchicalSpiritsRoot } from '@/hooks/use-hierarchical-spirits-root'
import { HierarchicalFilter } from '@/lib/hierarchical-filter'
import { cn } from '@/lib/utils'

export type Props = Omit<ButtonProps, 'onSelect'> & {
  root?: HierarchicalFilter
  openOnKey?: (e: globalThis.KeyboardEvent) => boolean
  onSelect(selection: SelectOptions): void
}

export function BarAddIngredientCommandDialogButton({
  children,
  root,
  onClick,
  openOnKey,
  onSelect,
  ...props
}: Props) {
  const { ingredientDict } = useData()
  const baseRoot = useHierarchicalSpiritsRoot()
  const getPathName = useGetIngredientPathName()

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

  async function handleSelect(selection: SelectOptions) {
    onSelect(selection)
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
      <CommandDialog
        open={open}
        onOpenChange={(value) => setOpen(value)}
        onKeyDown={handleDialogKey}
      >
        <CommandInput
          placeholder="Filter ingredients..."
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
          <HierarchicalCommandList
            root={root ?? baseRoot}
            hasSearch={Boolean(search)}
            groupTrunks
            getName={getPathName}
            getBottleName={(id) => ingredientDict[id]?.name ?? ''}
            renderName={(path, full) => (
              <IngredientPathText path={path} full={full} />
            )}
            onSelect={handleSelect}
          />
        </CommandList>
      </CommandDialog>
    </>
  )
}
