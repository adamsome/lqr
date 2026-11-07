import { IngredientDataProvider } from '@/app/components/data-provider'
import {
  AppBack,
  AppFullWidthContent,
  AppHeader,
  AppLayout,
} from '@/app/components/layout/app-layout'
import { Level } from '@/app/components/layout/level'
import { SidebarLayout } from '@/app/components/layout/sidebar-layout'
import { Stack } from '@/app/components/layout/stack'
import { FollowButtonContainer } from '@/app/components/user/follow-button-container'
import { UserAvatarHeader } from '@/app/components/user/user-avatar-header'
import { getIngredientData } from '@/app/lib/model/ingredient-data'
import { isOnboarding, startFtue } from '@/app/lib/model/ftue'
import { getCurrentUser } from '@/app/lib/model/user'
import { toHome } from '@/app/lib/routes'
import { LayoutProps } from '@/app/lib/types'
import { Bar } from '@/app/u/[username]/bar/bar'
import { Onboarding } from '@/app/u/[username]/bar/onboarding'

export const revalidate = 0

type Props = LayoutProps<{
  username?: string
}>

export default async function Layout(props: Props) {
  const params = (await props.params) ?? {}

  const { children } = props

  const { username } = params ?? {}
  const { user, currentUser, isCurrentUser } = await getCurrentUser(username)
  const data = await getIngredientData(user?.id)

  // Covers users who reach their bar without passing through `/u`
  if (isCurrentUser && currentUser && !currentUser.ftue) {
    await startFtue(currentUser)
  }
  const onboarding =
    isCurrentUser && currentUser && isOnboarding(currentUser.ftue) ? (
      <Onboarding userID={currentUser.id} username={currentUser.username} />
    ) : null

  return (
    <IngredientDataProvider {...data}>
      <AppLayout>
        <AppHeader title="Bar">
          {currentUser && !isCurrentUser && (
            <AppBack href={toHome(user?.username)} user={user} />
          )}
        </AppHeader>
        <SidebarLayout
          sidebar={
            <AppFullWidthContent>
              <Stack gap={4}>
                <UserAvatarHeader username={username} selected="bottles">
                  {!isCurrentUser && (
                    <FollowButtonContainer
                      className="md:hidden"
                      username={username}
                    />
                  )}
                </UserAvatarHeader>
                <Bar username={username} onboarding={onboarding} />
              </Stack>
            </AppFullWidthContent>
          }
        >
          <AppFullWidthContent className="hidden md:block md:ps-2">
            <Level className="mb-6 h-18 w-full" justify="end">
              {!isCurrentUser && <FollowButtonContainer username={username} />}
            </Level>
            {children}
          </AppFullWidthContent>
        </SidebarLayout>
      </AppLayout>
    </IngredientDataProvider>
  )
}
