'use client'

import { ReactNode, createContext, useContext } from 'react'

import { Data } from '@/lib/types'

const DataContext = createContext<Data | undefined>(undefined)

type Props = Data & {
  children: ReactNode
}

export const DataProvider = ({ children, ...value }: Props) => {
  const { Provider } = DataContext
  return <Provider value={value}>{children}</Provider>
}

export const useData = (): Data => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('Called useData before setting DataProvider context')
  }
  return context
}
