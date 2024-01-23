import { auth } from '@clerk/nextjs'
import { ReactNode } from 'react'

import { IngredientDataProvider } from '@/app/components/data-provider'
import * as ResponsiveLayout from '@/app/components/layout/responsive-layout'
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
  const { userId } = auth()
  const user = await getUserByID(userId)
  const data = await getIngredientData()
  return (
    <IngredientDataProvider {...data}>
      <ResponsiveLayout.Root>
        <ResponsiveLayout.Header title="Research">
          <ResponsiveLayout.Back href={toHome(user?.username)} user={user} />
        </ResponsiveLayout.Header>
        <Container className="py-4 sm:py-6 gap-y-4 sm:gap-y-4">
          <H1>Research</H1>
          {children}
        </Container>
      </ResponsiveLayout.Root>
    </IngredientDataProvider>
  )
}
