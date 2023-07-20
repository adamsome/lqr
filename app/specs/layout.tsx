import { ReactNode } from 'react'

import { DataProvider } from '@/components/data-provider'
import { getData } from '@/lib/model/data'
import { Container } from '@/components/ui/container'

export const revalidate = 0

type Props = {
  children: ReactNode
}

export default async function Layout({ children }: Props) {
  const data = await getData()
  return (
    <DataProvider {...data}>
      <Container>{children}</Container>
    </DataProvider>
  )
}
