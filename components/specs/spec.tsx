'use client'

import { SpecIngredient } from '@/components/specs/spec-ingredient'
import { Spec } from '@/lib/types'

type Props = {
  spec: Spec
}

export function Spec({ spec }: Props) {
  const { name, ingredients, source } = spec
  return (
    <div className="flex flex-col gap-y-6">
      <div className="flex flex-col gap-y-1.5">
        <div className="text-lg font-semibold leading-none tracking-tight">
          {name}
        </div>
        {source && (
          <div className="text-sm text-muted-foreground">{source}</div>
        )}
      </div>
      <div>
        <div className="flex flex-col gap-2">
          {ingredients.map((ingredient, i) => (
            <SpecIngredient
              key={`${i}_${ingredient.name ?? ingredient.id}`}
              ingredient={ingredient}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
