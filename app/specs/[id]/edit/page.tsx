import { auth } from '@clerk/nextjs'
import { Suspense } from 'react'
import invariant from 'tiny-invariant'

import { SpecContainer } from '@/app/specs/[id]/edit/spec-container'
import { getSpec } from '@/lib/model/spec'
import { getOneUser } from '@/lib/model/user'

export const revalidate = 0

type Props = {
  params: {
    id: string
  }
}

export default async function Page({ params }: Props) {
  const { id } = params
  const { userId: userID } = auth()
  // TODO: User URL `u` param to get specs
  invariant(userID, 'Must be logged in to view specs.')
  const user = await getOneUser(userID)
  const spec = await getSpec({ id })
  invariant(spec, `No spec found with id '${id}'`)
  return (
    <Suspense>
      <SpecContainer spec={spec} user={user} />
    </Suspense>
  )
}
