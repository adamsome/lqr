import { ReactNode } from 'react'

import { Ingredient } from '@/app/u/[username]/specs/[id]/ingredient'
import { DotSeparator } from '@/app/components/ui/dot-separator'
import { getGlassTypeLabel } from '@/app/lib/glass-type'
import { getMixTypeLabel } from '@/app/lib/mix-type'
import { getSpecCategoryLabel } from '@/app/lib/spec-category'
import { IngredientData, Spec } from '@/app/lib/types'
import { Title } from '@/app/u/[username]/specs/[id]/title'

type Props = {
  spec: Spec
  data: IngredientData
  userAvatar?: ReactNode
  updated?: ReactNode
  showStock?: boolean
}

export function Spec({ spec, data, userAvatar, updated, showStock }: Props) {
  const {
    name,
    year,
    ingredients,
    stock,
    category,
    mix,
    glass,
    notesHtml,
    referenceHtml,
  } = spec
  return (
    <>
      <div className="flex flex-col gap-y-1">
        <Title className="mb-3 text-4xl whitespace-normal" spec={spec} />
        <div className="flex items-center gap-4">
          {userAvatar && <div>{userAvatar}</div>}
          {updated && (
            <div className="text-muted-foreground/60 hidden sm:inline-block">
              {updated}
            </div>
          )}
        </div>
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
            showStock={showStock}
          />
        ))}
      </div>
      {notesHtml && (
        <div
          className="text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: notesHtml }}
        />
      )}
      {referenceHtml && (
        <div
          className="text-muted-foreground/50 text-xs font-medium"
          dangerouslySetInnerHTML={{ __html: referenceHtml }}
        />
      )}
    </>
  )
}
