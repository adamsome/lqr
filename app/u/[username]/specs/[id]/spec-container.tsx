import { auth } from '@clerk/nextjs'
import { intlFormatDistance, parseISO } from 'date-fns/fp'
import { micromark } from 'micromark'
import invariant from 'tiny-invariant'

import { UserAvatar } from '@/app/components/user/user-avatar'
import { UserAvatarLink } from '@/app/components/user/user-avatar-link'
import { getSpecStock } from '@/app/lib/ingredient/get-spec-stock'
import { getIngredientData } from '@/app/lib/model/ingredient-data'
import { getSpec } from '@/app/lib/model/spec'
import { toHome } from '@/app/lib/routes'
import { User } from '@/app/lib/types'
import { Back } from '@/app/u/[username]/specs/[id]/back'
import { Spec } from '@/app/u/[username]/specs/[id]/spec'
import { SpecLayout } from '@/app/u/[username]/specs/[id]/spec-layout'

type Props = {
  specID: string
  user: User
  showEdit: boolean
}

export async function SpecContainer({ specID, user, showEdit }: Props) {
  const { userId: currentUserID } = auth()
  const [data, spec] = await Promise.all([
    getIngredientData(),
    getSpec(specID, user.id),
  ])

  invariant(spec, `No spec with id '${specID}'.`)

  const { dict, tree } = data

  const getStock = getSpecStock(dict, tree)
  const enhancedSpec = { ...spec, stock: getStock(spec) }
  if (spec?.notes) {
    enhancedSpec.notesHtml = micromark(spec.notes)
  }
  if (spec?.reference) {
    enhancedSpec.referenceHtml = micromark(`—${spec.reference}`)
  }

  const updatedDistance = intlFormatDistance(
    new Date(),
    parseISO(spec.updatedAt),
  )
  const updated = `Updated ${updatedDistance}`

  return (
    <SpecLayout
      spec={spec}
      showEdit={showEdit}
      status={updated}
      back={<Back user={user} />}
    >
      <Spec
        spec={enhancedSpec}
        data={data}
        userAvatar={
          <UserAvatarLink href={toHome(user.username)} accent>
            <UserAvatar user={user} size="lg" />
          </UserAvatarLink>
        }
        updated={updated}
        showStock={Boolean(currentUserID)}
      />
    </SpecLayout>
  )
}
