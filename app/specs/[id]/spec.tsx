'use client'

import Link from 'next/link'

import { Ingredient } from '@/app/specs/[id]/ingredient'
import { Button } from '@/components/ui/button'
import { DotSeparator } from '@/components/ui/dot-separator'
import { getGlassTypeLabel } from '@/lib/glass-type'
import { getMixTypeLabel } from '@/lib/mix-type'
import { toSpecEdit } from '@/lib/routes'
import { getSpecCategoryLabel } from '@/lib/spec-category'
import { IngredientData, Spec } from '@/lib/types'
import { useUser } from '@/hooks/use-user'

type Props = {
  spec: Spec
  data: IngredientData
}

export function Spec({ spec, data }: Props) {
  const {
    id,
    name,
    year,
    username,
    userDisplayName,
    ingredients,
    stock,
    category,
    mix,
    glass,
    notes,
  } = spec
  const { id: userID, admin } = useUser()
  return (
    <div className="flex flex-col gap-6 sm:flex-row">
      <div className="flex flex-1 flex-col gap-y-6">
        <div className="flex flex-col gap-y-1">
          <div className="mb-3 text-4xl font-semibold leading-none tracking-tight">
            {name}
            {year && <span className="text-muted-foreground"> ({year})</span>}
          </div>
          {(userDisplayName || username) && (
            <div className="text-xl">{userDisplayName ?? username}</div>
          )}
          {(category || mix || glass) && (
            <DotSeparator className="font-semibold text-muted-foreground">
              {category && <div>{getSpecCategoryLabel(category)}</div>}
              {mix && <div>{getMixTypeLabel(mix)}</div>}
              {glass && <div>{getGlassTypeLabel(glass)} Glass</div>}
            </DotSeparator>
          )}
        </div>
        <div className="flex flex-col gap-2">
          {ingredients.map((ingredient, i) => (
            <Ingredient
              key={`${i}_${ingredient.name ?? ingredient.id}`}
              data={data}
              ingredient={ingredient}
              stock={stock?.ingredients[i]}
            />
          ))}
        </div>
        {notes && <div className="text-muted-foreground">{notes}</div>}
      </div>
      {(admin || userID === spec.userID) && (
        <div>
          <Button asChild variant="outline">
            <Link href={toSpecEdit(id)}>Edit</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
