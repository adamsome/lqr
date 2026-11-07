import { ReactNode } from 'react'

import { Level } from '@/app/components/layout/level'
import { Stack } from '@/app/components/layout/stack'
import { CardContent, CardHeader } from '@/app/components/ui/card'
import { LINK_BOX_CLASSNAME, LinkBoxLink } from '@/app/components/ui/link-box'
import { getIngredientView as makeGetIngredientView } from '@/app/lib/ingredient/get-ingredient-view'
import { CompProps, IngredientData, Spec } from '@/app/lib/types'
import { capitalize, cn, rejectNil } from '@/app/lib/utils'
import { Title } from '@/app/u/[username]/specs/[id]/title'

type Props = {
  className?: string
  data: IngredientData
  spec: Spec
  href?: string
  description?: ReactNode
  actions?: ReactNode
}

export function Card({
  className,
  data,
  spec,
  href,
  description,
  actions,
}: Props) {
  const { ingredients } = spec
  const getIngredientView = makeGetIngredientView(data.dict)
  const title = <Title className="text-base" spec={spec} />
  return (
    <Stack
      className={cn(
        'w-full rounded pb-1.5 pt-1 transition-colors',
        href &&
          'transition-colors hover:bg-muted/50 focus:bg-muted active:bg-muted',
        LINK_BOX_CLASSNAME,
        className,
      )}
      gap={0.5}
    >
      <CardHeader className="w-full px-2 py-0">
        <Level gap={0.5}>
          {href ? (
            <LinkBoxLink
              className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap"
              href={href}
            >
              {title}
            </LinkBoxLink>
          ) : (
            title
          )}
          {actions && <div className="z-10 -me-1 flex-shrink-0">{actions}</div>}
        </Level>
        {description}
      </CardHeader>
      <CardContent className="line-clamp-2 px-2 py-0 text-xs font-medium text-muted-foreground">
        {ingredients
          .map((it) => {
            const view = getIngredientView(it)
            if (view.error)
              console.warn(`Ingredient parsing issue with spec '${spec.name}'`)
            return view
          })
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
        'flex w-full items-center gap-4 overflow-hidden py-px text-muted-foreground',
        className,
      )}
    >
      {children}
    </div>
  )
}
