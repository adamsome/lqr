import { auth } from '@clerk/nextjs'
import invariant from 'tiny-invariant'

import { Spec } from '@/app/u/[username]/specs/[id]/spec'
import { getSpecData } from '@/lib/model/spec-data'
import { getUser, getUserByID } from '@/lib/model/user'
import { isAdmin } from '@/lib/model/admin'

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
  const [spec, data] = await getSpecData(user?.id, id)

  // TODO: Show "User not found"
  invariant(user, `User not found.`)
  invariant(spec && data, `No spec with id '${id}'.`)

  return (
    <Spec
      spec={spec}
      data={data}
      user={user}
      // TODO: Check if current user is admin
      showEdit={isAdmin(currentUserID) || user.id === currentUserID}
    />
  )
}
