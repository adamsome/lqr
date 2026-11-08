import { requireSessionUserID } from '@/app/lib/session'
import { Suspense } from 'react'
import invariant from 'tiny-invariant'

import { SpecContainer } from '@/app/u/[username]/create-spec/spec-container'
import { getCurrentUser } from '@/app/lib/model/user'
import { PageProps } from '@/app/lib/types'
import { isAdmin } from '@/app/lib/model/admin'

type Props = PageProps<{
  username: string
}>

export default async function Page(props: Props) {
  await requireSessionUserID()
  const params = (await props.params) ?? {}
  const { user, currentUser } = await getCurrentUser(params.username)
  invariant(user, `User not found.`)
  invariant(
    isAdmin(currentUser?.id) || currentUser?.id === user.id,
    `You cannot create a spec as another user.`,
  )
  return (
    <Suspense>
      <SpecContainer />
    </Suspense>
  )
}
