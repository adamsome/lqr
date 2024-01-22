import { FollowButtonContainer } from '@/app/u/[username]/follow-button-container'
import { UserAvatarHeader } from '@/app/u/[username]/user-avatar-header'
import { Container } from '@/components/layout/container'
import { Back, Header, Root } from '@/components/layout/responsive-layout'
import { Stack } from '@/components/layout/stack'
import { UserAvatar } from '@/components/user-avatar'
import { getCurrentUser } from '@/lib/model/user'
import { toHome } from '@/lib/routes'
import { LayoutProps } from '@/lib/types'

export const revalidate = 0

type Props = LayoutProps<{
  username?: string
}>

export default async function Layout({ children, params = {} }: Props) {
  const { username } = params
  const { user, currentUser, isCurrentUser } = await getCurrentUser(username)
  return (
    <Root>
      <Header title={<UserAvatar user={user} />}>
        {currentUser && !isCurrentUser && (
          <Back href={toHome(currentUser.username)} user={currentUser} />
        )}
      </Header>

      <Container className="my-4 sm:my-6 [--container-w-max:800px]">
        <Stack className="gap-5 sm:gap-6">
          <UserAvatarHeader username={username} />
          {children}
        </Stack>
      </Container>
    </Root>
  )
}
