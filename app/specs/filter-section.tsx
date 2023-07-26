import { ReactNode } from 'react'

type Props = {
  children: ReactNode
  name: string
}

export function FilterSection({ children, name }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <p className="font-semibold tracking-tight">{name}</p>
      {children}
    </div>
  )
}
