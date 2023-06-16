import { DataProvider } from '@/components/data-provider'
import { Container } from '@/components/ui/container'
import { getData } from '@/lib/model/data'
import { ReactNode } from 'react'

export const revalidate = 0

type Props = {
  children: ReactNode
  params: {
    id: string
  }
}

export default async function Page({ children, params }: Props) {
  const data = await getData()
  return (
    <DataProvider {...data}>
      <Container>{children}</Container>
    </DataProvider>
  )
}
