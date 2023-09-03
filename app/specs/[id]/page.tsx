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
  const { id } = params
  const { userId: userID } = auth()
  // TODO: User URL `u` param to get specs
  invariant(userID, 'Must be logged in to view specs.')
  const user = await getOneUser(userID)
  const [spec, data] = await getSpecData(id)
  return <Spec spec={spec} data={data} user={user} />
}
