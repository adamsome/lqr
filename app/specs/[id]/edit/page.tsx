import invariant from 'tiny-invariant'

import { Spec } from '@/app/specs/[id]/edit/spec'
import { getSpec } from '@/lib/model/spec'

export const revalidate = 0

type Props = {
  params: {
    id: string
  }
}

export default async function Page({ params }: Props) {
  const { id } = params
  const spec = await getSpec(id)
  invariant(spec, `No spec found with id '${id}'`)
  return <Spec spec={spec} />
}
