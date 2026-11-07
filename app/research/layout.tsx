import { auth } from '@clerk/nextjs/server'
import { ReactNode } from 'react'

import { IngredientDataProvider } from '@/app/components/data-provider'
import {
  AppBack,
  AppHeader,
  AppLayout,
} from '@/app/components/layout/app-layout'
import { Container } from '@/app/components/layout/container'
import { H1 } from '@/app/components/ui/h1'
import { getIngredientData } from '@/app/lib/model/ingredient-data'
import { getUserByID } from '@/app/lib/model/user'
import { toHome } from '@/app/lib/routes'

export const revalidate = 0

type Props = {
  children: ReactNode
}

export default async function Layout({ children }: Props) {
  const { userId } = await auth()
  const user = await getUserByID(userId)
  const data = await getIngredientData()
  return (
    <IngredientDataProvider {...data}>
      <AppLayout>
        <AppHeader title="Research">
          <AppBack href={toHome(user?.username)} user={user} />
        </AppHeader>
        <Container className="gap-y-4 py-4 sm:gap-y-4 sm:py-6">
          <H1>Research</H1>
          {children}
        </Container>
      </AppLayout>
    </IngredientDataProvider>
  )
}
