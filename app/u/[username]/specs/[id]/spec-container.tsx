import { micromark } from 'micromark'
import invariant from 'tiny-invariant'

import { RelativeTime } from '@/app/components/relative-time'
import { UserAvatar } from '@/app/components/user/user-avatar'
import { UserAvatarLink } from '@/app/components/user/user-avatar-link'
import { getSpecStock } from '@/app/lib/ingredient/get-spec-stock'
import { isAdmin } from '@/app/lib/model/admin'
import { getIngredientData } from '@/app/lib/model/ingredient-data'
import { getSpec } from '@/app/lib/model/spec'
import { getCurrentUser } from '@/app/lib/model/user'
import { toHome } from '@/app/lib/routes'
import { Back } from '@/app/u/[username]/specs/[id]/back'
import { Spec } from '@/app/u/[username]/specs/[id]/spec'
import { SpecLayout } from '@/app/u/[username]/specs/[id]/spec-layout'

type Props = {
  username?: string
  specID?: string
}

export async function SpecContainer({ username, specID }: Props) {
  invariant(specID, `ID needed to show spec.`)

  const { user, currentUser } = await getCurrentUser(username)

  invariant(user, `User not found.`)

  const showEdit = isAdmin(currentUser?.id) || user.id === currentUser?.id

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

  const updated = <RelativeTime date={spec.updatedAt} prefix="Updated" />

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
        showStock={Boolean(currentUser?.id)}
      />
    </SpecLayout>
  )
}
