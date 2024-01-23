import { auth } from '@clerk/nextjs'
import { Suspense } from 'react'
import invariant from 'tiny-invariant'

import { isAdmin } from '@/app/lib/model/admin'
import { getSpec } from '@/app/lib/model/spec'
import { getUser } from '@/app/lib/model/user'
import { PageProps } from '@/app/lib/types'
import { SpecContainer } from '@/app/u/[username]/specs/[id]/edit/spec-container'

export const revalidate = 0

type Props = PageProps<{
  username: string
  id: string
}>

export default async function Page({ params = {} }: Props) {
  const { username, id } = params

  const { userId: currentUserID } = auth()

  const user = await getUser(username)
  const spec = await getSpec(id, user?.id)

  invariant(user, `User not found.`)
  invariant(spec, `No spec found with id '${id}'.`)
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
