import { KeyboardEvent, useEffect, useState } from 'react'

import { useIngredientData } from '@/components/data-provider'
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
import { useGetIngredientName } from '@/hooks/use-get-ingredient-name'
import { useGetIngredientPathName } from '@/hooks/use-get-ingredient-path-name'
import { useHierarchicalSpiritsRoot } from '@/hooks/use-hierarchical-spirits-root'
import { CATEGORY_DICT, Category } from '@/lib/generated-consts'
import { HierarchicalFilter } from '@/lib/hierarchical-filter'
import { Ingredient } from '@/lib/types'
import { cn } from '@/lib/utils'

export type Props = Omit<ButtonProps, 'onSelect'> & {
  topItems?: Ingredient[]
  root?: HierarchicalFilter
  muteItems?: boolean
  mutating?: boolean
  openOnKey?: (e: globalThis.KeyboardEvent) => boolean
  onSelect(selection: SelectOptions): void
}

export function BarAddIngredientCommandDialogButton({
  children,
  topItems,
  root,
  muteItems,
  mutating,
  onClick,
  openOnKey,
  onSelect,
  ...props
}: Props) {
  const { dict } = useIngredientData()
  const baseRoot = useHierarchicalSpiritsRoot()
  const getIngredientPathName = useGetIngredientPathName()
  const getName = useGetIngredientName()

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
        disabled={mutating}
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
            topItems={topItems}
            root={root ?? baseRoot}
            hasSearch={Boolean(search)}
            groupTrunks
            showBottles
            muteItems={muteItems}
            rejectCheckedLeaves
            getIngredientPathName={getIngredientPathName}
            renderName={({ id, path, item }) => {
              if (path) return <IngredientPathText id={id} path={path} />
              if (item) return getName(item)
              if (!id) return 'Unknown Ingredient'
              return (
                dict[id]?.name ??
                CATEGORY_DICT[id as Category]?.name ??
                getName({ id })
              )
            }}
            onSelect={handleSelect}
          />
        </CommandList>
      </CommandDialog>
    </>
  )
}
