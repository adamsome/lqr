import { ReactNode } from 'react'

import { DataProvider } from '@/components/data-provider'
import { Container } from '@/components/ui/container'
import { H1 } from '@/components/ui/h1'
import { getData } from '@/lib/get-data'

export const revalidate = 0

type Props = {
  children: ReactNode
}

export default async function Layout({ children }: Props) {
  const data = await getData()
  return (
    <DataProvider {...data}>
      <Container className="relative py-8">
        <section className="flex flex-col gap-4">
          <H1>Stock</H1>
          {children}
        </section>
      </Container>
    </DataProvider>
  )
}
