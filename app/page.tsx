import { CardGrid } from '@/app/components/layout/card-grid'
import { Container } from '@/app/components/layout/container'
import * as Layout from '@/app/components/layout/responsive-layout'
import { CardHeader, CardLink } from '@/app/components/ui/card'
import { UserAvatar } from '@/app/components/user/user-avatar'
import { getCurrentUser } from '@/app/lib/model/user'
import { toBar, toResearch, toSpecs } from '@/app/lib/routes'

export const revalidate = 0

export default async function Page() {
  const { currentUser } = await getCurrentUser()
  const { username } = currentUser ?? {}

  // TODO: Show non-signed-in homepage if no user

  return (
    <Layout.Root>
      <Layout.Header title={<UserAvatar user={currentUser} />} />
      <Container className="relative py-4 sm:py-6">
        <UserAvatar user={currentUser} size="2xl" />
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
    </Layout.Root>
  )
}
