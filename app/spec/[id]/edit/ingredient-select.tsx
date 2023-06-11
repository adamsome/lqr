'use client'

import { useEffect, useState } from 'react'

import { Button, Props as ButtonProps } from '@/components/ui/button'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Amount, Usage, SpecIngredient } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useGetIngredientName } from '@/hooks/use-get-ingredient-name'

type Option<T> = { label: string; value: T }

const kinds = [
  { value: 'spirit', label: 'Spirits' },
  { value: 'bitters', label: 'Bitters' },
  { value: 'syrup', label: 'Syrup, Sugar & Muddled' },
  { value: 'juice', label: 'Juice & Coffee' },
  { value: 'soda', label: 'Soda, Wine & Beer' },
  { value: 'dairy', label: 'Eggs, Milk & Cream' },
  { value: 'garnish', label: 'Garnish' },
] as const

type Kind = (typeof kinds)[number]['value']

const byKind: Record<Kind, SpecIngredient[]> = {
  spirit: [
    { id: 'grain_gin_londondry' },
    { id: 'grain_whiskey_rye' },
    { id: 'fortifiedwine_sweetvermouth' },
    { id: 'fortifiedwine_dryvermouth' },
    { id: 'agave_mezcal' },
    { id: 'agave_tequila_blanco' },
    { id: 'cane_rum' },
    { id: 'liqueur_absinthe' },
    { id: 'liqueur_maraschino' },
    { id: 'liqueur_orange' },
    { id: 'liqueur_amaro_aperitivo', bottleID: 'campari' },
    { id: 'liqueur_amaro_carciofo', bottleID: 'cynar' },
    { id: 'grain_whiskey_bourbon' },
    { id: 'grain_whiskey_scotch_blended' },
    { id: 'grain_whiskey_scotch_islay' },
    { id: 'brandy_grape_cognac' },
    { id: 'brandy_apple' },
    // TODO: All spirit categories
    // TODO: Rum selector
  ],
  bitters: [
    { id: 'bitters_aromatic', bottleID: 'angostura' },
    { id: 'bitters_creole', bottleID: 'peychauds' },
    { id: 'bitters_orange' },
    // TODO: Rest of bitters
  ],
  syrup: [
    { id: 'syrup_simple' },
    { id: 'syrup_demerara' },
    { id: 'syrup_honey' },
    { id: 'syrup_grenadine' },
    { id: 'syrup_maple' },
    { id: 'syrup_orgeat' },
    { id: 'syrup_cinnamon' },
    { id: 'syrup_agave' },
    { id: 'cream_coconut' },
    { id: 'sugar_demerara', usage: 'muddled' },
    { id: 'sugar_brown', usage: 'muddled' },
    { id: 'sugar_white', usage: 'muddled' },
    { id: 'spice_mint', usage: 'muddled' },
    { id: 'spice_ginger', usage: 'muddled' },
    // TODO: Rest of syrup
  ],
  juice: [
    { id: 'juice_lemon' },
    { id: 'juice_lime' },
    { id: 'juice_grapefruit' },
    { id: 'juice_orange' },
    { id: 'juice_pineapple' },
    { id: 'coffee_hot' },
    { id: 'coffee_coldbrew' },
    // TODO: Rest of juice
  ],
  soda: [
    { id: 'soda_club' },
    { id: 'wine_sparkling' },
    { id: 'soda_tonic' },
    { id: 'soda_gingerbeer' },
    { id: 'soda_ginger' },
    { id: 'soda_guava' },
    { id: 'fortifiedwine_sherry_oloroso' },
    { id: 'fortifiedwine_sherry_palecream' },
    { id: 'fortifiedwine_sherry_pedroximenez' },
    { id: 'fortifiedwine_sherry' },
    { id: 'beer_pilsner' },
    { id: 'beer_ipa' },
    { id: 'beer_grapefruit' },
    { id: 'beer_gose' },
    { id: 'wine_red' },
    { id: 'wine_red_lambrusco' },
    { id: 'wine_red_malbec' },
    { id: 'wine_red_rancio' },
    { id: 'wine_red_syrah' },
    { id: 'wine_sake_sparkling' },
    { id: 'wine_sweet' },
    { id: 'wine_sweet_moscatel' },
    { id: 'wine_sweet_sauternes' },
    { id: 'wine_white_riesling' },
  ],
  dairy: [
    { id: 'egg_white' },
    { id: 'egg_yolk' },
    { id: 'egg_whole' },
    { id: 'cream_heavy' },
    { id: 'milk_whole' },
    { id: 'milk_condensed' },
    { id: 'cream_coconut' },
    { id: 'milk_coconut' },
    { id: 'water_coconut' },
    { id: 'egg_aquafaba' },
  ],
  garnish: [
    { id: 'fruit_lemon', usage: 'twist' },
    { id: 'fruit_orange', usage: 'twist' },
    { id: 'fruit_grapefruit', usage: 'twist' },
    { id: 'fruit_olive', usage: 'whole' },
    { id: 'fruit_cherry', usage: 'whole' },
    { id: 'spice_mint', usage: 'whole' },
    { id: 'spice_salt', usage: 'rim' },
    { id: 'sugar_white', usage: 'rim' },
    { id: 'spice_nutmeg', usage: 'grated' },
    { id: 'spice_cinnamon', usage: 'grated' },
    { id: 'spice_ginger', usage: 'grated' },
    { id: 'spice_cloves', usage: 'grated' },
    // TODO: Rest of [chocolate, coffee_bean, cheese, leaf, flower, fruit, nut, spice, vegetable]
  ],
}

const amountDict: Partial<Record<Kind | Usage, Option<Amount>[]>> = {
  spirit: [
    { label: '2 oz', value: { quantity: 2, unit: 'oz' } },
    { label: '1 1/2 oz', value: { quantity: 1.5, unit: 'oz' } },
    { label: '1 oz', value: { quantity: 1, unit: 'oz' } },
    { label: '3/4 oz', value: { quantity: 0.75, unit: 'oz' } },
    { label: '1/2 oz', value: { quantity: 0.5, unit: 'oz' } },
    { label: '1/4 oz', value: { quantity: 0.25, unit: 'oz' } },
    { label: '2 tsp', value: { quantity: 2, unit: 'tsp' } },
    { label: '1 tsp', value: { quantity: 1, unit: 'tsp' } },
    { label: '1/2 tsp', value: { quantity: 0.5, unit: 'tsp' } },
    { label: '1/4 tsp', value: { quantity: 0.4, unit: 'tsp' } },
    { label: 'Rinse', value: { usage: 'rinse' } },
    {
      label: 'Float 1 oz',
      value: { usage: 'float', quantity: 1, unit: 'oz' },
    },
    {
      label: 'Float 3/4 oz',
      value: { usage: 'float', quantity: 0.75, unit: 'oz' },
    },
    {
      label: 'Float 1/2 oz',
      value: { usage: 'float', quantity: 0.5, unit: 'oz' },
    },
    {
      label: 'Float 1/4 oz',
      value: { usage: 'float', quantity: 0.25, unit: 'oz' },
    },
    { label: '1 dash', value: { quantity: 1, unit: 'dash' } },
    { label: '2 dashes', value: { quantity: 2, unit: 'dash' } },
    { label: '3 dashes', value: { quantity: 3, unit: 'dash' } },
    { label: '5 dashes', value: { quantity: 5, unit: 'dash' } },
    { label: '8 dashes', value: { quantity: 8, unit: 'dash' } },
    { label: '10 dashes', value: { quantity: 10, unit: 'dash' } },
    { label: '4 oz', value: { quantity: 4, unit: 'oz' } },
    { label: '3 oz', value: { quantity: 3, unit: 'oz' } },
    { label: '2 1/2 oz', value: { quantity: 2.5, unit: 'oz' } },
    { label: '1 3/4 oz', value: { quantity: 1.75, unit: 'oz' } },
    { label: '1 1/4 oz', value: { quantity: 1.25, unit: 'oz' } },
  ],
  bitters: [
    { label: '1 dash', value: { quantity: 1, unit: 'dash' } },
    { label: '2 dashes', value: { quantity: 2, unit: 'dash' } },
    { label: '3 dashes', value: { quantity: 3, unit: 'dash' } },
    { label: '5 dashes', value: { quantity: 5, unit: 'dash' } },
    { label: '8 dashes', value: { quantity: 8, unit: 'dash' } },
    { label: '10 dashes', value: { quantity: 10, unit: 'dash' } },
    { label: '1/4 tsp', value: { quantity: 0.4, unit: 'tsp' } },
    { label: '1/2 tsp', value: { quantity: 0.5, unit: 'tsp' } },
    { label: '1 tsp', value: { quantity: 1, unit: 'tsp' } },
    { label: '2 tsp', value: { quantity: 2, unit: 'tsp' } },
    { label: '1/4 oz', value: { quantity: 0.25, unit: 'oz' } },
    { label: '1/2 oz', value: { quantity: 0.5, unit: 'oz' } },
    { label: '3/4 oz', value: { quantity: 0.75, unit: 'oz' } },
    { label: '1 oz', value: { quantity: 1, unit: 'oz' } },
    { label: '1 1/2 oz', value: { quantity: 1.5, unit: 'oz' } },
    { label: '2 oz', value: { quantity: 2, unit: 'oz' } },
    {
      label: 'Float 1 dash',
      value: { usage: 'float', quantity: 1, unit: 'dash' },
    },
    {
      label: 'Float 2 dashes',
      value: { usage: 'float', quantity: 2, unit: 'dash' },
    },
    {
      label: 'Float 3 dashes',
      value: { usage: 'float', quantity: 3, unit: 'dash' },
    },
    {
      label: 'Float 5 dashes',
      value: { usage: 'float', quantity: 5, unit: 'dash' },
    },
  ],
  juice: [
    { label: '1/2 oz', value: { quantity: 0.5, unit: 'oz' } },
    { label: '3/4 oz', value: { quantity: 0.75, unit: 'oz' } },
    { label: '1 oz', value: { quantity: 1, unit: 'oz' } },
    { label: '1 1/2 oz', value: { quantity: 1.5, unit: 'oz' } },
    { label: '2 oz', value: { quantity: 2, unit: 'oz' } },
    { label: '1/4 tsp', value: { quantity: 0.4, unit: 'tsp' } },
    { label: '1/2 tsp', value: { quantity: 0.5, unit: 'tsp' } },
    { label: '1 tsp', value: { quantity: 1, unit: 'tsp' } },
    { label: '2 tsp', value: { quantity: 2, unit: 'tsp' } },
    { label: '1/4 oz', value: { quantity: 0.25, unit: 'oz' } },
    { label: '1 1/4 oz', value: { quantity: 1.25, unit: 'oz' } },
    { label: '1 3/4 oz', value: { quantity: 1.75, unit: 'oz' } },
    { label: '2 1/2 oz', value: { quantity: 2.5, unit: 'oz' } },
    { label: '3 oz', value: { quantity: 3, unit: 'oz' } },
    { label: '4 oz', value: { quantity: 4, unit: 'oz' } },
  ],
  twist: [
    { label: 'Twist', value: { quantity: 1, usage: 'twist' } },
    { label: '2 twists', value: { quantity: 2, usage: 'twist' } },
    { label: 'Wedge', value: { usage: 'wedge' } },
    { label: 'Wheel', value: { usage: 'wheel' } },
    { label: 'Rim', value: { usage: 'rim' } },
  ],
  whole: [
    { label: '1', value: { quantity: 1, usage: 'whole' } },
    { label: '2', value: { quantity: 2, usage: 'whole' } },
    { label: '3', value: { quantity: 3, usage: 'whole' } },
    { label: '5', value: { quantity: 5, usage: 'whole' } },
    { label: '1/2', value: { quantity: 0.5, usage: 'whole' } },
    { label: '1/4', value: { quantity: 0.25, usage: 'whole' } },
  ],
  rim: [
    { label: 'Rim', value: { usage: 'rim' } },
    {
      label: '1/4 tsp',
      value: { usage: 'grated', quantity: 0.25, unit: 'tsp' },
    },
    {
      label: '1/2 tsp',
      value: { usage: 'grated', quantity: 0.5, unit: 'tsp' },
    },
    {
      label: '1 tsp',
      value: { usage: 'grated', quantity: 1, unit: 'tsp' },
    },
    {
      label: '2 tsp',
      value: { usage: 'grated', quantity: 2, unit: 'tsp' },
    },
  ],
  grated: [
    { label: 'Grated', value: { usage: 'grated' } },
    {
      label: '1/4 tsp grated',
      value: { usage: 'grated', quantity: 0.25, unit: 'tsp' },
    },
    {
      label: '1/2 tsp grated',
      value: { usage: 'grated', quantity: 0.5, unit: 'tsp' },
    },
    {
      label: '1 tsp grated',
      value: { usage: 'grated', quantity: 1, unit: 'tsp' },
    },
    {
      label: '2 tsp grated',
      value: { usage: 'grated', quantity: 2, unit: 'tsp' },
    },
  ],
  muddled: [
    { label: 'Muddled', value: { usage: 'muddled' } },
    {
      label: '1 muddled',
      value: { usage: 'muddled', quantity: 1 },
    },
    {
      label: '2 muddled',
      value: { usage: 'muddled', quantity: 2 },
    },
    {
      label: '3 muddled',
      value: { usage: 'muddled', quantity: 3 },
    },
    {
      label: '5 muddled',
      value: { usage: 'muddled', quantity: 5 },
    },
    {
      label: '8 muddled',
      value: { usage: 'muddled', quantity: 8 },
    },
    {
      label: '1/4 tsp muddled',
      value: { usage: 'muddled', quantity: 0.25, unit: 'tsp' },
    },
    {
      label: '1/2 tsp muddled',
      value: { usage: 'muddled', quantity: 0.5, unit: 'tsp' },
    },
    {
      label: '1 tsp muddled',
      value: { usage: 'muddled', quantity: 1, unit: 'tsp' },
    },
    {
      label: '2 tsp muddled',
      value: { usage: 'muddled', quantity: 2, unit: 'tsp' },
    },
  ],
}

amountDict.soda = amountDict.juice!.map((a) => ({
  ...a,
  value: { ...a.value, usage: 'top' },
}))
amountDict.dairy = [
  { label: '1', value: { quantity: 1 } },
  { label: '2', value: { quantity: 2 } },
  ...amountDict.juice!,
]
amountDict.garnish = [
  ...amountDict.twist!,
  ...amountDict.whole!,
  ...amountDict.rim!,
  ...amountDict.grated!,
  ...amountDict.muddled!,
]

type Props = Omit<ButtonProps, 'onSelect'> & {
  openOnKey?: (e: KeyboardEvent) => boolean
  onSelect(ingredient: SpecIngredient): void
}

export function IngredientSelect({
  children,
  onClick,
  openOnKey,
  onSelect,
  ...props
}: Props) {
  const getName = useGetIngredientName()
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [kind, setKind] = useState<Kind | null>(null)
  const [ingredient, setIngredient] = useState<SpecIngredient | null>(null)

  let amounts: Option<Amount>[] | undefined
  if (ingredient) {
    if (ingredient.usage) amounts = amountDict[ingredient.usage]
    if (!amounts && kind) amounts = amountDict[kind]
    if (!amounts) amounts = amountDict.spirit
  }

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (openOnKey?.(e)) {
        setOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [openOnKey])

  function handleClose() {
    setIngredient(null)
    setKind(null)
    setSearch('')
    setOpen(false)
  }

  function handleSelect(value: Amount) {
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
        onKeyDown={(e) => {
          // Escape goes to previous page
          // Backspace goes to previous page when search is empty
          if (e.key === 'Escape' || (e.key === 'Backspace' && !search)) {
            e.preventDefault()
            if (ingredient) setIngredient(null)
            else if (kind) setKind(null)
            else handleClose()
          }
        }}
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
          {!amounts && !kind && (
            <CommandGroup>
              {kinds.map(({ value, label }) => (
                <CommandItem
                  key={value}
                  onSelect={() => {
                    setKind(value)
                    setSearch('')
                  }}
                >
                  {label}
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {!amounts && kind && (
            <CommandGroup>
              {byKind[kind].map((it) => (
                <CommandItem
                  key={it.id ?? it.bottleID ?? ''}
                  onSelect={() => {
                    setIngredient(it)
                    setSearch('')
                  }}
                >
                  {getName(it, { inclBottle: true })}
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {amounts && ingredient && (
            <CommandGroup>
              {amounts.map(({ label, value }) => (
                <CommandItem
                  key={`${value.usage ?? 'na'}_${value.unit ?? 'na'}_${
                    value.quantity ?? 'na'
                  }`}
                  onSelect={() => handleSelect(value)}
                >
                  {label}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}
