import { Fragment, useMemo } from 'react'

import {
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from '@/components/ui/command'
import { useGetIngredientName } from '@/hooks/use-get-ingredient-name'
import { Option, SpecIngredient } from '@/lib/types'

const rawRumOptions: Option<Partial<Option<SpecIngredient>>[]>[] = [
  {
    label: 'Common Bottles',
    value: [
      {
        label: 'Smith & Cross (Pot Still Lightly Aged Overproof Jamaican)',
        value: {
          id: 'cane_rum_jamaican',
          bottleID: 'smith_cross_navy_strength',
          productionMethod: 'pot',
          aging: ['light'],
          overproof: true,
        },
      },
      {
        label: 'Appleton Estate Signature Blend (Blended Lightly Aged)',
        value: {
          id: 'cane_rum_jamaican',
          bottleID: 'appleton_estate_signature_blend',
          productionMethod: 'blended',
          aging: ['light'],
        },
      },
      {
        label: 'Plantation O.F.T.D. (Black Blended Aged Overproof)',
        value: {
          id: 'cane_rum',
          bottleID: 'plantation_oftd',
          productionMethod: 'blended',
          aging: ['medium'],
          black: true,
          overproof: true,
        },
      },
      {
        label: 'Wray & Nephew (Pot Still Unaged Overproof Jamaican)',
        value: {
          id: 'cane_rum_jamaican',
          bottleID: 'wray_nephew_overproof',
          productionMethod: 'pot',
          aging: ['none'],
          overproof: true,
        },
      },
    ],
  },
  {
    label: 'Minimalist Tiki',
    value: [
      {
        value: { id: 'cane_rum_jamaican', aging: ['light', 'medium', 'long'] },
      },
      { value: { id: 'cane_rum', aging: ['light'] } },
      { value: { id: 'cane_rum', aging: ['medium', 'long'] } },
      {
        value: { id: 'cane_rum_demerara', aging: ['light', 'medium', 'long'] },
      },
      { value: { id: 'cane_rum_demerara', overproof: true } },
      { value: { id: 'cane_rum_agricole' } },
      { value: { id: 'cane_rum_jamaican', aging: ['none'], overproof: true } },
    ],
  },
  {
    label: "Smuggler's Cove",
    value: [
      {
        value: {
          id: 'cane_rum',
          productionMethod: 'blended',
          aging: ['light'],
        },
      },
      {
        value: {
          id: 'cane_rum',
          productionMethod: 'blended',
          aging: ['medium', 'long'],
        },
      },
      {
        value: {
          id: 'cane_rum',
          productionMethod: 'column',
          aging: ['medium', 'long'],
        },
      },
      { value: { id: 'cane_rum', productionMethod: 'blended', black: true } },
      {
        value: {
          id: 'cane_rum',
          productionMethod: 'blended',
          black: true,
          overproof: true,
        },
      },
      { value: { id: 'cane_rum_agricole', aging: ['none'] } },
      {
        value: { id: 'cane_rum_agricole', aging: ['light', 'medium', 'long'] },
      },
      {},
      {
        value: { id: 'cane_rum', productionMethod: 'column', aging: ['light'] },
      },
      { value: { id: 'cane_rum', productionMethod: 'pot', aging: ['none'] } },
      { value: { id: 'cane_rum', productionMethod: 'pot', aging: ['light'] } },
      {
        value: {
          id: 'cane_rum',
          productionMethod: 'pot',
          aging: ['medium', 'long'],
        },
      },
      {
        value: {
          id: 'cane_rum',
          productionMethod: 'blended',
          aging: ['light'],
          black: true,
        },
      },
      { value: { id: 'cane_rum', productionMethod: 'pot', black: true } },
      {
        value: {
          id: 'cane_rum_agricole',
          productionMethod: 'coffey',
          aging: ['light', 'medium', 'long'],
        },
      },
      {
        value: {
          id: 'cane_rum_agricole',
          productionMethod: 'pot',
          aging: ['none'],
        },
      },
      {
        value: {
          id: 'cane_rum_agricole',
          productionMethod: 'pot',
          aging: ['light', 'medium', 'long'],
        },
      },
    ],
  },
]

type Props = {
  stocked?: Set<string>
  onSelect(ingredient: SpecIngredient): void
}

export function RumItems({ stocked, onSelect }: Props) {
  const getName = useGetIngredientName()
  const rumOptions = useMemo(() => {
    return rawRumOptions.map((group) => {
      const value = group.value.map(({ label = '', value }) => {
        if (!value) return null
        return label ? { label, value } : { label: getName(value), value }
      })
      return { ...group, value }
    })
  }, [getName])

  function isStocked(it: SpecIngredient): boolean {
    if (!stocked) return false
    return stocked.has(it.bottleID ?? '') || stocked.has(it.id ?? '')
  }

  return (
    <>
      <CommandGroup>
        <CommandItem onSelect={() => onSelect({ id: 'cane_rum' })}>
          Any Rum
        </CommandItem>
      </CommandGroup>
      {rumOptions.map((group) => (
        <Fragment key={group.label}>
          <CommandSeparator />
          <CommandGroup heading={group.label}>
            {group.value.map((opt, i) =>
              opt ? (
                <CommandItem
                  key={opt.label}
                  disabled={isStocked(opt.value)}
                  onSelect={() => !isStocked(opt.value) && onSelect(opt.value)}
                >
                  {opt.label}
                </CommandItem>
              ) : (
                <CommandSeparator key={`separator_${i}`} className="my-1" />
              ),
            )}
          </CommandGroup>
        </Fragment>
      ))}
    </>
  )
}
