import { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export function CardGrid({ children }: Props) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(theme(spacing.64),1fr))] gap-4 lg:gap-6">
      {children}
    </div>
  )
}
