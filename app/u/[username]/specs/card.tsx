import { ReactNode } from 'react'

import { CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import {
  LINK_BOX_CLASSNAME,
  LinkBox,
  LinkBoxLink,
} from '@/app/components/ui/link-box'
import { getIngredientView as makeGetIngredientView } from '@/app/lib/ingredient/get-ingredient-view'
import { CompProps, IngredientData, Spec } from '@/app/lib/types'
import { capitalize, cn, rejectNil } from '@/app/lib/utils'
import { Stack } from '@/app/components/layout/stack'

type Props = {
  className?: string
  data: IngredientData
  spec: Spec
  href?: string
  description?: ReactNode
}

export function Card({ className, data, spec, href, description }: Props) {
  const { name, year, ingredients } = spec
  const getIngredientView = makeGetIngredientView(data.dict)
  const title = (
    <CardTitle className="text-base font-bold whitespace-nowrap text-ellipsis overflow-hidden">
      {name}
      {year && (
        <span className="text-muted-foreground font-medium"> ({year})</span>
      )}
    </CardTitle>
  )
  return (
    <Stack
      className={cn(
        'pt-1 pb-1.5 w-full rounded transition-colors',
        href &&
          'transition-colors hover:bg-muted/50 focus:bg-muted active:bg-muted',
        LINK_BOX_CLASSNAME,
        className,
      )}
      gap={0.5}
    >
      <CardHeader className="px-2 py-0 w-full">
        {href ? <LinkBoxLink href={href}>{title}</LinkBoxLink> : title}
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

export function CardDescription({ children, className }: CompProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-4 py-px w-full text-muted-foreground overflow-hidden',
        className,
      )}
    >
      {children}
    </div>
  )
}
