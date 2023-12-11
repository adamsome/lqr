import { Pencil2Icon } from '@radix-ui/react-icons'
import { intlFormatDistance, parseISO } from 'date-fns/fp'
import Link from 'next/link'

import { Ingredient } from '@/app/specs/[id]/ingredient'
import * as Layout from '@/components/responsive-layout'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { DotSeparator } from '@/components/ui/dot-separator'
import { getGlassTypeLabel } from '@/lib/glass-type'
import { getMixTypeLabel } from '@/lib/mix-type'
import { SPECS, toSpecEdit } from '@/lib/routes'
import { getSpecCategoryLabel } from '@/lib/spec-category'
import { IngredientData, Spec, User } from '@/lib/types'

type Props = {
  spec: Spec
  data: IngredientData
  user: User
}

export function Spec({ spec, data, user }: Props) {
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
    updatedAt,
  } = spec
  const { id: userID, admin } = user

  const updatedDistance = intlFormatDistance(new Date(), parseISO(updatedAt))
  const lastUpdated = `Updated ${updatedDistance}`

  return (
    <Layout.Root>
      <Layout.Header title={name}>
        <Layout.Back href={SPECS} user={user} />
        <Layout.Actions>
          {(admin || userID === spec.userID) && (
            /* TODO: Hide when logged in */
            <Link href={toSpecEdit(id)}>
              <Button className="gap-2" size="sm">
                <Pencil2Icon />
                <span className="pe-1">Edit</span>
              </Button>
            </Link>
          )}
        </Layout.Actions>
      </Layout.Header>

      <Container className="py-8 [--container-w-max:800px]">
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
      </Container>

      <Layout.Footer status={lastUpdated}>
        <span />
        {(admin || userID === spec.userID) && (
          /* TODO: Hide when logged in */
          <Link href={toSpecEdit(id)}>
            <Button className="w-11 h-11" variant="link" size="xs">
              <Pencil2Icon className="w-6 h-6" />
            </Button>
          </Link>
        )}
      </Layout.Footer>
    </Layout.Root>
  )
}
