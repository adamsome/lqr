import { FollowButtonContainer } from '@/app/components/user/follow-button-container'
import { UserAvatarHeader } from '@/app/components/user/user-avatar-header'
import { Container } from '@/app/components/layout/container'
import { Back, Header, Root } from '@/app/components/layout/responsive-layout'
import { Stack } from '@/app/components/layout/stack'
import { UserAvatar } from '@/app/components/user/user-avatar'
import { getCurrentUser } from '@/app/lib/model/user'
import { toHome } from '@/app/lib/routes'
import { LayoutProps } from '@/app/lib/types'

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
