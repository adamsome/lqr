import { ReactNode } from 'react'

import { Header } from '@/components/header'

type Props = {
  children: ReactNode
  modal: ReactNode
}

export default function SpecsLayout({ children, modal }: Props) {
  return (
    <div>
      <div>Layout Modal .{modal}.</div>
      {children}
    </div>
  )
}
