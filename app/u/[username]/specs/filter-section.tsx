import { Level } from '@/app/components/layout/level'
import { ReactNode } from 'react'

type Props = {
  children: ReactNode
  name: string
  actions?: ReactNode
}

export function FilterSection({ children, name, actions }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <Level>
        <p className="flex-1 font-semibold tracking-tight">{name}</p>
        {actions}
      </Level>
      {children}
    </div>
  )
}
