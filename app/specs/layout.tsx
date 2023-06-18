import { DataProvider } from '@/components/data-provider'
import { getData } from '@/lib/model/data'
import { ReactNode } from 'react'

export const revalidate = 0

type Props = {
  children: ReactNode
  modal: ReactNode
}

export default async function Layout({ children, modal }: Props) {
  const data = await getData()
  return (
    <DataProvider {...data}>
      {modal}
      {children}
    </DataProvider>
  )
}
