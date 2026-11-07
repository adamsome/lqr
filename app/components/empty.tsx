import { Stack } from '@/app/components/layout/stack'
import { CompProps } from '@/app/lib/types'
import { ReactNode } from 'react'

type Props = CompProps & {
  title?: ReactNode
}

export function Empty({ children, className, title }: Props) {
  return (
    <Stack
      className="min-h-52 w-full rounded-lg border-2 border-dashed px-4 py-6 text-center font-medium leading-tight text-muted-foreground/80"
      justify="center"
      items="center"
    >
      <p className="text-lg font-semibold text-muted-foreground">{title}</p>
      {children}
    </Stack>
  )
}
