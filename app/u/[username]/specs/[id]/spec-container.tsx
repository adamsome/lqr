import { micromark } from 'micromark'
import invariant from 'tiny-invariant'

import { Back } from '@/app/u/[username]/specs/[id]/back'
import { Spec } from '@/app/u/[username]/specs/[id]/spec'
import { SpecLayout } from '@/app/u/[username]/specs/[id]/spec-layout'
import { UserAvatar } from '@/components/user-avatar'
import { getSpecStock } from '@/lib/ingredient/get-spec-stock'
import { getIngredientData } from '@/lib/model/ingredient-data'
import { getSpec } from '@/lib/model/spec'
import { User } from '@/lib/types'
import Link from 'next/link'
import { toHome } from '@/lib/routes'
import { intlFormatDistance, parseISO } from 'date-fns/fp'
import { auth } from '@clerk/nextjs'

type Props = {
  specID: string
  user: User
  showEdit: boolean
}

export async function SpecContainer({ specID, user, showEdit }: Props) {
  const { userId: currentUserID } = auth()
  const [data, spec] = await Promise.all([
    getIngredientData(),
    getSpec({ id: specID, userID: user.id }),
  ])

  // TODO: Show No Spec found
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
          <Link href={toHome(user.username)}>
            <UserAvatar user={user} size="lg" />
          </Link>
        }
        updated={updated}
        showStock={Boolean(currentUserID)}
      />
    </SpecLayout>
  )
}
