import { CommandGroup, CommandItem } from '@/components/ui/command'
import { IngredientKind } from '@/lib/ingredient/kind'
import { Amount, Option, SpecIngredient, Usage } from '@/lib/types'

const kindAmountDict: Partial<
  Record<IngredientKind | Usage, Option<Amount>[]>
> = {
  spirit: [
    { label: '2 oz', value: { quantity: 2, unit: 'oz' } },
    { label: '1 1/2 oz', value: { quantity: 1.5, unit: 'oz' } },
    { label: '1 oz', value: { quantity: 1, unit: 'oz' } },
    { label: '3/4 oz', value: { quantity: 0.75, unit: 'oz' } },
    { label: '1/2 oz', value: { quantity: 0.5, unit: 'oz' } },
    { label: '1/4 oz', value: { quantity: 0.25, unit: 'oz' } },
    { label: '2 tsp', value: { quantity: 2, unit: 'tsp' } },
    { label: '1 tsp', value: { quantity: 1, unit: 'tsp' } },
    { label: '3/4 tsp', value: { quantity: 0.75, unit: 'tsp' } },
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
    { label: '3/4 tsp', value: { quantity: 0.75, unit: 'tsp' } },
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
    { label: '3/4 tsp', value: { quantity: 0.75, unit: 'tsp' } },
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
      label: '3/4 tsp',
      value: { usage: 'grated', quantity: 0.75, unit: 'tsp' },
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
      label: '3/4 tsp grated',
      value: { usage: 'grated', quantity: 0.75, unit: 'tsp' },
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
      label: '3/4 tsp grated',
      value: { usage: 'muddled', quantity: 0.75, unit: 'tsp' },
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

kindAmountDict.soda = kindAmountDict.juice!.map((a) => ({
  ...a,
  value: { ...a.value, usage: 'top' },
}))
kindAmountDict.dairy = [
  { label: '1', value: { quantity: 1 } },
  { label: '2', value: { quantity: 2 } },
  ...kindAmountDict.juice!,
  ...(kindAmountDict.spirit?.filter((it) => it.value.usage === 'float') ?? []),
]
kindAmountDict.garnish = [
  ...kindAmountDict.twist!,
  ...kindAmountDict.whole!,
  ...kindAmountDict.rim!,
  ...kindAmountDict.grated!,
  ...kindAmountDict.muddled!,
]

type Props = {
  kind: IngredientKind
  ingredient: SpecIngredient
  onSelect(amount: Amount): void
}

export function AmountItems({ kind, ingredient, onSelect }: Props) {
  let amounts: Option<Amount>[] | undefined
  if (ingredient) {
    if (ingredient.usage) amounts = kindAmountDict[ingredient.usage]
    if (!amounts && kind) amounts = kindAmountDict[kind]
    if (!amounts) amounts = kindAmountDict.spirit
  }
  if (!amounts?.length) return null
  return (
    <CommandGroup>
      {amounts.map(({ label, value }) => (
        <CommandItem
          key={`${value.usage ?? 'na'}_${value.unit ?? 'na'}_${
            value.quantity ?? 'na'
          }`}
          onSelect={() => onSelect(value)}
        >
          {label}
        </CommandItem>
      ))}
    </CommandGroup>
  )
}
