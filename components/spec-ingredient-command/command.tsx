import { Dispatch } from 'react'

import { AmountItems } from '@/components/spec-ingredient-command/amount-items'
import { Breadcrumb } from '@/components/spec-ingredient-command/breadcrumb'
import { IngredientItems } from '@/components/spec-ingredient-command/ingredient-items'
import { Action, State } from '@/components/spec-ingredient-command/reducer'
import { RumItems } from '@/components/spec-ingredient-command/rum-items'
import { SpiritItems } from '@/components/spec-ingredient-command/spirit-items'
import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { INGREDIENT_KINDS } from '@/lib/ingredient/kind'
import { Amount, SpecIngredient } from '@/lib/types'
import { cn } from '@/lib/utils'

type Props = {
  state: State
  dispatch: Dispatch<Action>
  submitAmount(value: Amount): void
}

export function IngredientCommand(props: Props) {
  const { state, dispatch } = props
  const { search } = state
  return (
    <>
      <Breadcrumb {...props} />
      <CommandInput
        placeholder="Type a command or search..."
        value={search}
        onValueChange={(value) => dispatch({ type: 'setSearch', value })}
      />
      <CommandList
        className={cn(
          '[--padding:theme(spacing.12)]',
          'max-h-[calc(100vh-var(--padding)-theme(spacing.24)-3px)]'
        )}
      >
        <CommandEmpty>No results found.</CommandEmpty>
        <Items {...props} />
      </CommandList>
    </>
  )
}

function Items({ state, dispatch, submitAmount }: Props) {
  const { search, kind, ingredient, special } = state

  const onSelectIngredient = (ingredient: SpecIngredient) =>
    dispatch({ type: 'setIngredient', ingredient })

  if (!kind) {
    return (
      <CommandGroup>
        {INGREDIENT_KINDS.map(({ value, label }) => (
          <CommandItem
            key={value}
            onSelect={() => dispatch({ type: 'setKind', kind: value })}
          >
            {label}
          </CommandItem>
        ))}
        <CommandItem onSelect={() => dispatch({ type: 'openCustom' })}>
          Custom
        </CommandItem>
      </CommandGroup>
    )
  }
  if (ingredient) {
    return (
      <AmountItems
        kind={kind}
        ingredient={ingredient}
        onSelect={submitAmount}
      />
    )
  }
  if (special === 'allSpirits') {
    return (
      <SpiritItems hasSearch={Boolean(search)} onSelect={onSelectIngredient} />
    )
  }
  if (special === 'rum') {
    return <RumItems onSelect={onSelectIngredient} />
  }
  return (
    <>
      {kind === 'spirit' && (
        <>
          <CommandGroup>
            <CommandItem onSelect={() => dispatch({ type: 'setAllSpirits' })}>
              All Spirits
            </CommandItem>
          </CommandGroup>
          <CommandSeparator className="mb-1" />
        </>
      )}
      <IngredientItems kind={kind} onSelect={onSelectIngredient} />
    </>
  )
}