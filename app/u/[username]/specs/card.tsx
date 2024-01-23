import { ReactNode } from 'react'

import { CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import {
  LINK_BOX_CLASSNAME,
  LinkBox,
  LinkBoxLink,
} from '@/app/components/ui/link-box'
import { getIngredientView as makeGetIngredientView } from '@/app/lib/ingredient/get-ingredient-view'
import { IngredientData, Spec } from '@/app/lib/types'
import { capitalize, cn, rejectNil } from '@/app/lib/utils'
import { Stack } from '@/app/components/layout/stack'

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
    <Stack
      className={cn(
        'pt-1 pb-1.5 w-full rounded transition-colors hover:bg-muted/50 focus:bg-muted active:bg-muted',
        LINK_BOX_CLASSNAME,
      )}
      gap={0.5}
    >
      <CardHeader className="px-2 py-0 w-full">
        <LinkBoxLink href={href}>
          <CardTitle className="text-sm sm:text-base font-bold whitespace-nowrap text-ellipsis overflow-hidden">
            {name}
            {year && (
              <span className="text-muted-foreground font-medium">
                {' '}
                ({year})
              </span>
            )}
          </CardTitle>
        </LinkBoxLink>
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
    </Stack>
  )
}
