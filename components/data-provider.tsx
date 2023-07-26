'use client'

import { ReactNode, createContext, useContext } from 'react'

import { IngredientData } from '@/lib/types'

const IngredientDataContext = createContext<IngredientData | undefined>(
  undefined
)

type Props = IngredientData & {
  children: ReactNode
}

export const IngredientDataProvider = ({ children, ...value }: Props) => {
  const { Provider } = IngredientDataContext
  return <Provider value={value}>{children}</Provider>
}

export const useIngredientData = (): IngredientData => {
  const context = useContext(IngredientDataContext)
  if (!context) {
    throw new Error('Called useData before setting DataProvider context')
  }
  return context
}
