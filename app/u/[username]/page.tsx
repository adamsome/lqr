import invariant from 'tiny-invariant'

import { UserHome } from '@/app/u/[username]/user-home'
import * as Layout from '@/components/responsive-layout'
import { Container } from '@/components/ui/container'
import { UserAvatar } from '@/components/user-avatar'
import { getUser } from '@/lib/model/user'

export const revalidate = 0

type Props = {
  params: {
    username: string
  }
}

export default async function Page({ params }: Props) {
  const { username } = params
  const user = await getUser(username)

  // TODO: Show "User not found"
  invariant(user, `User not found.`)

  return (
    <Layout.Root>
      <Layout.Header title={<UserAvatar user={user} />} />
      <Container className="relative py-4 sm:py-6 font-semibold">
        <UserHome user={user} />
      </Container>
    </Layout.Root>
  )
}
