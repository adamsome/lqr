import { ReactNode } from 'react'

import { IngredientDataProvider } from '@/app/components/data-provider'
import { getIngredientData } from '@/app/lib/model/ingredient-data'
import { SAMPLE_INGREDIENT_DATA } from '../lib/ingredient/samples'

export const revalidate = 0

type Props = {
  children: ReactNode
}

export default async function Layout({ children }: Props) {
  const data = await getIngredientData()

  return <IngredientDataProvider {...data}>{children}</IngredientDataProvider>
}
