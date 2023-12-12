import { auth } from '@clerk/nextjs'
import { ReactNode } from 'react'
import invariant from 'tiny-invariant'

import { IngredientDataProvider } from '@/components/data-provider'
import * as ResponsiveLayout from '@/components/responsive-layout'
import { Container } from '@/components/ui/container'
import { H1 } from '@/components/ui/h1'
import { getIngredientData } from '@/lib/model/ingredient-data'
import { getOneUser } from '@/lib/model/user'
import { HOME } from '@/lib/routes'

export const revalidate = 0

type Props = {
  children: ReactNode
}

export default async function Layout({ children }: Props) {
  const { userId: userID } = auth()
  const user = await getOneUser(userID)
  const data = await getIngredientData()
  return (
    <IngredientDataProvider {...data}>
      <ResponsiveLayout.Root>
        <ResponsiveLayout.Header title="Research">
          <ResponsiveLayout.Back href={HOME} user={user} />
        </ResponsiveLayout.Header>
        <Container className="relative py-4 sm:py-6">
          <section className="flex flex-col gap-5">
            <H1>Research</H1>
            {children}
          </section>
        </Container>
      </ResponsiveLayout.Root>
    </IngredientDataProvider>
  )
}
