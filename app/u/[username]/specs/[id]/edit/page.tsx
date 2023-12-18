import { auth } from '@clerk/nextjs'
import { Suspense } from 'react'
import invariant from 'tiny-invariant'

import { SpecContainer } from '@/app/u/[username]/specs/[id]/edit/spec-container'
import { isAdmin } from '@/lib/model/admin'
import { getSpec } from '@/lib/model/spec'
import { getUser } from '@/lib/model/user'

export const revalidate = 0

type Props = {
  params: {
    username: string
    id: string
  }
}

export default async function Page({ params }: Props) {
  const { username, id } = params

  const { userId: currentUserID } = auth()

  const user = await getUser(username)
  const spec = await getSpec({ id })

  // TODO: Show "User not found"
  invariant(user, `User not found.`)

  // TODO: Show "Spec not found"
  invariant(spec, `No spec found with id '${id}'.`)

  // TODO: Cannot edit other user's specs
  invariant(
    isAdmin(currentUserID) || currentUserID === spec.userID,
    `Only creator of spec with id '${id}' can edit.`,
  )

  return (
    <Suspense>
      <SpecContainer spec={spec} />
    </Suspense>
  )
}
