import { Stack } from '@/app/components/layout/stack'
import { getSpec } from '@/app/lib/model/spec'
import { SYSTEM_USERS, getCurrentUser, getUserByID } from '@/app/lib/model/user'
import type { PageProps } from '@/app/lib/types'
import { head } from '@/app/lib/utils'
import { Form } from '@/app/u/[username]/specs/@modal/[id]/change-user/form'
import { specUserIDParam } from '@/app/u/[username]/specs/@modal/[id]/change-user/types'
import { Title } from '@/app/u/[username]/specs/[id]/title'
import { useRouter } from 'next/navigation'

type Props = PageProps<{
  username?: string
  id?: string
}>

export default async function Page({ params = {}, searchParams = {} }: Props) {
  const { username, id } = params
  const userID = head(searchParams[specUserIDParam])
  const [{ currentUser }, specUser] = await Promise.all([
    getCurrentUser(),
    getUserByID(userID),
  ])
  if (!username || !userID || !currentUser || !specUser) return null
  const spec = await getSpec(id, userID)

  if (!spec) return null

  return (
    <Stack gap={6}>
      <Title className="text-xl" spec={spec} />
      <Form
        spec={spec}
        username={username}
        currentUser={currentUser}
        specUser={specUser}
        users={SYSTEM_USERS.filter(
          ({ id }) => ![userID, currentUser.id].includes(id),
        )}
      />
    </Stack>
  )
}
