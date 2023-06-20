import { ReactNode } from 'react'

import { DataProvider } from '@/components/data-provider'
import { getData } from '@/lib/model/data'

export const revalidate = 0

type Props = {
  children: ReactNode
}

export default async function Layout({ children }: Props) {
  const data = await getData()
  return <DataProvider {...data}>{children}</DataProvider>
}
