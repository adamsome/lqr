import { ReactNode } from 'react'

type Props = {
  children: ReactNode
  modal: ReactNode
}

export default function SpecsLayout({ children, modal }: Props) {
  return (
    <>
      {modal}
      {children}
    </>
  )
}
