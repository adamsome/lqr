import Link from 'next/link'
import { ReactNode } from 'react'

import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getIngredientView as makeGetIngredientView } from '@/lib/ingredient/get-ingredient-view'
import { IngredientData, Spec } from '@/lib/types'
import { capitalize, rejectNil } from '@/lib/utils'

type Props = {
  data: IngredientData
  spec: Spec
  href: string
  description?: ReactNode
}

export function Card({ data, spec, href, description }: Props) {
  const { name, year, ingredients } = spec
  const getIngredientView = makeGetIngredientView(data.dict)
  return (
    <div className="isolate relative flex flex-col pt-1 pb-1.5 w-full rounded transition-colors hover:bg-muted/50 focus:bg-muted active:bg-muted">
      <CardHeader className="px-2 py-0 w-full">
        <Link className="before:absolute before:inset-0 before:z-0" href={href}>
          <CardTitle className="text-sm sm:text-base font-bold whitespace-nowrap text-ellipsis overflow-hidden">
            {name}
            {year && (
              <span className="text-muted-foreground font-medium">
                {' '}
                ({year})
              </span>
            )}
          </CardTitle>
        </Link>
        {description}
      </CardHeader>
      <CardContent className="px-2 py-0 text-xs text-muted-foreground font-medium line-clamp-2">
        {ingredients
          .map((it) => getIngredientView(it))
          .map(({ name, infusion }) =>
            rejectNil([infusion, capitalize(name)]).join(' '),
          )
          .join(', ')}
      </CardContent>
    </div>
  )
}
