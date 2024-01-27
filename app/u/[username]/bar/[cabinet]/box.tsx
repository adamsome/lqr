import { ReactNode } from 'react'

import { Stack } from '@/app/components/layout/stack'
import { BoxLink } from '@/app/u/[username]/bar/components/box'
import { CabinetDef } from '@/app/u/[username]/bar/lib/types'

type Props = {
  def: CabinetDef
  children?: ReactNode
  username?: string
}

export function Box({ children, username, def }: Props) {
  const { keys, name } = def
  return (
    <BoxLink username={username} name={name} {...keys} hideLink>
      <Stack>{children}</Stack>
    </BoxLink>
  )
}
