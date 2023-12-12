import { Spec } from '@/app/specs/[id]/spec'
import { getSpecData } from '@/lib/model/spec-data'
import { getOneUser } from '@/lib/model/user'
import { auth } from '@clerk/nextjs'
import invariant from 'tiny-invariant'

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
  const [spec, data] = await getSpecData(id)

  // TODO: Show "User not found"
  invariant(user, `User not found.`)

  return (
    <Spec
      spec={spec}
      data={data}
      user={user}
      // TODO: Check if current user is admin
      showEdit={user.admin || userID === currentUserID}
    />
  )
}
