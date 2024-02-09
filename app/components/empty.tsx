import { Stack } from '@/app/components/layout/stack'
import { CompProps } from '@/app/lib/types'
import { ReactNode } from 'react'

type Props = CompProps & {
  title?: ReactNode
}

export function Empty({ children, className, title }: Props) {
  return (
    <Stack
      className="px-4 py-6 w-full min-h-52 text-muted-foreground/80 text-center font-medium leading-tight border-2 border-dashed rounded-lg"
      justify="center"
      items="center"
    >
      <p className="text-muted-foreground text-lg font-semibold">{title}</p>
      {children}
    </Stack>
  )
}
