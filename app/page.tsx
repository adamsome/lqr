import { auth } from '@clerk/nextjs'

import * as ResponsiveLayout from '@/components/responsive-layout'
import { CardHeader, CardLink } from '@/components/ui/card'
import { CardGrid } from '@/components/ui/card-grid'
import { Container } from '@/components/ui/container'
import { UserAvatar } from '@/components/user-avatar'
import { getUserByID } from '@/lib/model/user'
import { toBar, toResearch, toSpecs } from '@/lib/routes'

export const revalidate = 0

export default async function Page() {
  const { userId: userID } = auth()
  const user = await getUserByID(userID)
  const username = user?.username

  // TODO: Show non-signed-in homepage if no user

  return (
    <ResponsiveLayout.Root>
      <ResponsiveLayout.Header title={<UserAvatar user={user} />} />
      <Container className="relative py-4 sm:py-6">
        <UserAvatar user={user} size="3xl" />
        {username && (
          <CardGrid>
            <CardLink href={toSpecs(username)}>
              <CardHeader>Specs</CardHeader>
            </CardLink>
            <CardLink href={toBar(username)}>
              <CardHeader>Bar</CardHeader>
            </CardLink>
            <CardLink href={toResearch()}>
              <CardHeader>Research</CardHeader>
            </CardLink>
          </CardGrid>
        )}
      </Container>
    </ResponsiveLayout.Root>
  )
}
