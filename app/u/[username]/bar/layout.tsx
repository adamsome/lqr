import { IngredientDataProvider } from '@/app/components/data-provider'
import {
  AppBack,
  AppFullWidthContent,
  AppHeader,
  AppLayout,
} from '@/app/components/layout/app-layout'
import { SidebarLayout } from '@/app/components/layout/sidebar-layout'
import { Stack } from '@/app/components/layout/stack'
import { UserAvatarHeader } from '@/app/components/user/user-avatar-header'
import { getIngredientData } from '@/app/lib/model/ingredient-data'
import { getCurrentUser } from '@/app/lib/model/user'
import { toHome } from '@/app/lib/routes'
import { LayoutProps } from '@/app/lib/types'
import { Bar } from '@/app/u/[username]/bar/bar'

export const revalidate = 0

type Props = LayoutProps<{
  username?: string
}>

export default async function Layout({ children, params }: Props) {
  const { username } = params ?? {}
  const { user, currentUser, isCurrentUser } = await getCurrentUser(username)
  const data = await getIngredientData(user?.id)

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
              <Stack gap={6}>
                <UserAvatarHeader username={username} selected="bottles" />
                <div className="-mx-2 sm:-ms-4">
                  <Bar username={username} />
                </div>
              </Stack>
            </AppFullWidthContent>
          }
        >
          <AppFullWidthContent className="hidden md:block md:pt-32 md:ps-2">
            {children}
          </AppFullWidthContent>
        </SidebarLayout>
      </AppLayout>
    </IngredientDataProvider>
  )
}
