import { micromark } from 'micromark'
import invariant from 'tiny-invariant'

import { Spec } from '@/app/u/[username]/specs/[id]/spec'
import { getSpecStock } from '@/lib/ingredient/get-spec-stock'
import { getIngredientData } from '@/lib/model/ingredient-data'
import { getSpec } from '@/lib/model/spec'
import { User } from '@/lib/types'

type Props = {
  specID: string
  user: User
  showEdit: boolean
}

export async function SpecContainer({ specID, user, showEdit }: Props) {
  invariant(specID, `ID needed to show spec.`)

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

  return <Spec spec={spec} data={data} user={user} showEdit={showEdit} />
}
