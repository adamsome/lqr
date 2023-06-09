'use client'

import { Ingredient } from '@/app/spec/[id]/ingredient'
import { Button } from '@/components/ui/button'
import { Spec } from '@/lib/types'
import Link from 'next/link'

type Props = {
  spec: Spec
}

export function Spec({ spec }: Props) {
  const { id, name, ingredients, source } = spec
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
        <div>
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
          <Link href={`/spec/${id}/edit`}>Edit</Link>
        </Button>
      </div>
    </div>
  )
}
