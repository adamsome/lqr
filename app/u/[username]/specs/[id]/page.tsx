import { auth } from '@clerk/nextjs'
import invariant from 'tiny-invariant'

import { SpecContainer } from '@/app/u/[username]/specs/[id]/spec-container'
import { isAdmin } from '@/lib/model/admin'
import { getUser } from '@/lib/model/user'

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

  // TODO: Show "User not found"
  invariant(user, `User not found.`)

  const showEdit = isAdmin(currentUserID) || user.id === currentUserID
  return <SpecContainer specID={id} user={user} showEdit={showEdit} />
}
