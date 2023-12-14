import { intlFormatDistance, parseISO } from 'date-fns/fp'
import Link from 'next/link'

import { Back } from '@/app/u/[username]/specs/[id]/back'
import { Ingredient } from '@/app/u/[username]/specs/[id]/ingredient'
import * as Layout from '@/components/responsive-layout'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { DotSeparator } from '@/components/ui/dot-separator'
import { getGlassTypeLabel } from '@/lib/glass-type'
import { getMixTypeLabel } from '@/lib/mix-type'
import { toSpecEdit } from '@/lib/routes'
import { getSpecCategoryLabel } from '@/lib/spec-category'
import { IngredientData, Spec, User } from '@/lib/types'

type Props = {
  spec: Spec
  data: IngredientData
  user: User
  showEdit: boolean
}

export function Spec({ spec, data, user, showEdit }: Props) {
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
    notesHtml,
    referenceHtml,
    updatedAt,
  } = spec

  const editUrl = toSpecEdit(username, id)
  const updatedDistance = intlFormatDistance(new Date(), parseISO(updatedAt))
  const lastUpdated = `Updated ${updatedDistance}`

  return (
    <Layout.Root>
      <Layout.Header title={name}>
        <Back user={user} />
        <Layout.Actions>
          {showEdit && (
            <Link href={editUrl}>
              <Button size="sm">Edit</Button>
            </Link>
          )}
        </Layout.Actions>
      </Layout.Header>

      <Container className="py-8 [--container-w-max:800px]">
        <div className="flex flex-col gap-y-1">
          <div className="mb-3 text-4xl font-bold leading-none tracking-tight">
            {name}
            {year && (
              <span className="text-muted-foreground font-medium">
                {' '}
                ({year})
              </span>
            )}
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
      </Container>

      <Layout.Footer status={lastUpdated}>
        <span />
        {showEdit && (
          <Link href={editUrl}>
            <Button className="text-base" variant="ghost">
              Edit
            </Button>
          </Link>
        )}
      </Layout.Footer>
    </Layout.Root>
  )
}
