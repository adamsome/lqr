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
  const { userId: currentUserID } = auth()
  // TODO: Use URL `u` param to get user spec
  const userID = currentUserID
  const user = await getOneUser(userID)

  const { id } = params
  const spec = await getSpec({ id })

  // TODO: Show "User not found"
  invariant(user, `User not found.`)

  // TODO: Show "Spec not found"
  invariant(spec, `No spec found with id '${id}'`)

  return (
    <Suspense>
      <SpecContainer spec={spec} user={user} />
    </Suspense>
  )
}
