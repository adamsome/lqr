import { IngredientDataProvider } from '@/app/components/data-provider'
import {
  AppBack,
  AppHeader,
  AppLayout,
} from '@/app/components/layout/app-layout'
import { SidebarLayout } from '@/app/components/layout/sidebar-layout'
import { getUserIngredientData } from '@/app/lib/model/ingredient-data'
import { toHome } from '@/app/lib/routes'
import { getStockedBottleCount } from '@/app/lib/stock'
import { LayoutProps } from '@/app/lib/types'
import { Sidebar } from '@/app/u/[username]/bar/sidebar'

export const revalidate = 0

type Props = LayoutProps<{
  username?: string
}>

export default async function Layout({ children, params }: Props) {
  const { username } = params ?? {}
  const { user, data } = await getUserIngredientData(username)
  const bottleCount = getStockedBottleCount(data.dict)

  return (
    <IngredientDataProvider {...data}>
      <AppLayout>
        <AppHeader title="Bar">
          <AppBack href={toHome(user?.username)} user={user} />
        </AppHeader>
        <SidebarLayout
          sidebar={
            <div className="-ms-1 sm:-ms-3 py-4 md:pt-8 md:pb-6">
              <Sidebar {...params} bottleCount={bottleCount} />
            </div>
          }
        >
          <div className="md:py-4 md:pt-1.5 md:pb-6">{children}</div>
        </SidebarLayout>
      </AppLayout>
    </IngredientDataProvider>
  )
}
