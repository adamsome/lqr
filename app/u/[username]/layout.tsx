import { ReactNode } from 'react'

import { IngredientDataProvider } from '@/components/data-provider'
import { getIngredientData } from '@/lib/model/ingredient-data'

export const revalidate = 0

type Props = {
  children: ReactNode
}

export default async function Layout({ children }: Props) {
  const data = await getIngredientData()
  return <IngredientDataProvider {...data}>{children}</IngredientDataProvider>
}
