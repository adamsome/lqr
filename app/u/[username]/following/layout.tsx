import {
  AppBack,
  AppContent,
  AppHeader,
  AppLayout,
} from '@/app/components/layout/app-layout'
import { Container } from '@/app/components/layout/container'
import { Stack } from '@/app/components/layout/stack'
import { UserAvatar } from '@/app/components/user/user-avatar'
import { UserAvatarHeader } from '@/app/components/user/user-avatar-header'
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
    <AppLayout>
      <AppHeader title={<UserAvatar user={user} />}>
        {currentUser && !isCurrentUser && (
          <AppBack href={toHome(currentUser.username)} user={currentUser} />
        )}
      </AppHeader>

      <AppContent className="pb-8 [--container-w-max:800px]">
        <Stack className="gap-5 sm:gap-6">
          <UserAvatarHeader username={username} />
          {children}
        </Stack>
      </AppContent>
    </AppLayout>
  )
}
