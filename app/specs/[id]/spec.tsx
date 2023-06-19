'use client'

import { Ingredient } from '@/app/specs/[id]/ingredient'
import { SpecStock } from '@/app/specs/[id]/spec-stock'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Spec } from '@/lib/types'
import Link from 'next/link'

type Props = {
  spec: Spec
}

export function Spec({ spec }: Props) {
  const { id, name, ingredients, source, stock } = spec
  return (
    <div className="flex flex-col gap-6 sm:flex-row">
      <div className="flex flex-1 flex-col gap-y-6">
        <div className="flex flex-col gap-y-1.5">
          <div className="text-lg font-semibold leading-none tracking-tight">
            {name}
          </div>
          {source && (
            <div className="text-sm text-muted-foreground">{source}</div>
          )}
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <Label>Ingredients</Label>
            <SpecStock stock={stock} />
          </div>
          <div className="flex flex-col gap-2">
            {ingredients.map((ingredient, i) => (
              <Ingredient
                key={`${i}_${ingredient.name ?? ingredient.id}`}
                ingredient={ingredient}
              />
            ))}
          </div>
        </div>
      </div>
      <div>
        <Button asChild variant="outline">
          <Link href={`/specs/${id}/edit`}>Edit</Link>
        </Button>
      </div>
    </div>
  )
}
