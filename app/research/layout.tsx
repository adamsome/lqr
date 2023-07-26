import { ReactNode } from 'react'

import { IngredientDataProvider } from '@/components/data-provider'
import { Container } from '@/components/ui/container'
import { H1 } from '@/components/ui/h1'
import { getIngredientData } from '@/lib/model/ingredient-data'

export const revalidate = 0

type Props = {
  children: ReactNode
}

export default async function Layout({ children }: Props) {
  const data = await getIngredientData()
  return (
    <IngredientDataProvider {...data}>
      <Container className="relative py-8">
        <section className="flex flex-col gap-4">
          <H1>Research</H1>
          {children}
        </section>
      </Container>
    </IngredientDataProvider>
  )
}
