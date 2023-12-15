import * as ResponsiveLayout from '@/components/responsive-layout'
import { CardHeader, CardLink } from '@/components/ui/card'
import { CardGrid } from '@/components/ui/card-grid'
import { Container } from '@/components/ui/container'
import { UserAvatar } from '@/components/user-avatar'
import { getUser } from '@/lib/model/user'
import { toBar, toResearch, toSpecs } from '@/lib/routes'

export const revalidate = 0

type Props = {
  params: {
    username: string
  }
}

export default async function Page({ params }: Props) {
  const { username } = params
  const user = await getUser(username)
  // TODO: Handle no user found
  return (
    <ResponsiveLayout.Root>
      <ResponsiveLayout.Header title={<UserAvatar user={user} />} />
      <Container className="relative py-4 sm:py-6">
        <UserAvatar user={user} size="3xl" />
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
      </Container>
    </ResponsiveLayout.Root>
  )
}
