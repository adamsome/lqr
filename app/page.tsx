import { auth } from '@clerk/nextjs'
import invariant from 'tiny-invariant'

import * as ResponsiveLayout from '@/components/responsive-layout'
import { CardHeader, CardLink } from '@/components/ui/card'
import { CardGrid } from '@/components/ui/card-grid'
import { Container } from '@/components/ui/container'
import { UserAvatar } from '@/components/user-avatar'
import { getOneUser } from '@/lib/model/user'
import { BAR, RESEARCH, SPECS } from '@/lib/routes'

export const revalidate = 0

export default async function Page() {
  const { userId: userID } = auth()
  const user = await getOneUser(userID)

  // TODO: Show non-signed-in homepage if no user

  return (
    <ResponsiveLayout.Root>
      <ResponsiveLayout.Header title={<UserAvatar user={user} />} />
      <Container className="relative py-4 sm:py-6">
        <UserAvatar user={user} size="3xl" />
        <CardGrid>
          <CardLink href={SPECS}>
            <CardHeader>Specs</CardHeader>
          </CardLink>
          <CardLink href={BAR}>
            <CardHeader>Bar</CardHeader>
          </CardLink>
          <CardLink href={RESEARCH}>
            <CardHeader>Research</CardHeader>
          </CardLink>
        </CardGrid>
      </Container>
    </ResponsiveLayout.Root>
  )
}
