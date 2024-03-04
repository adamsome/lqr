import { Level } from '@/app/components/layout/level'
import { getIngredientName } from '@/app/lib/ingredient/get-ingredient-name'
import { getIngredientData } from '@/app/lib/model/ingredient-data'
import { IngredientSuggestion as Suggestion } from '@/app/lib/suggestions/types'
import { getCategoryDef } from '@/app/u/[username]/bar/lib/defs'

type Props = Suggestion

export async function IngredientSuggestion({ items, exactCount }: Props) {
  const { dict } = await getIngredientData()
  const names = items.map((it) => {
    if (it.category) {
      return getCategoryDef(it).name
    }
    return getIngredientName(dict, it, { inclBottle: Boolean(it.bottleID) })
  })
  return (
    <Level className="bg-muted/50 text-foreground border-primary/5 whitespace-nowrap rounded border px-1 py-0.5 text-xs font-medium tracking-tighter shadow">
      {names.map((name, i) => (
        <div key={`${i}_${name}`}>{name}</div>
      ))}
      <Level className="text-muted-foreground font-bold" gap={0}>
        <div>+</div>
        <div>{exactCount}</div>
      </Level>
    </Level>
  )
}
