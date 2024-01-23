'use client'

import { BackButton } from '@/app/u/[username]/bar/components/back-button'
import { getCategoryDef } from '@/app/u/[username]/bar/lib/defs'
import { CategoryKeys } from '@/app/u/[username]/bar/lib/types'
import { Stack } from '@/app/components/layout/stack'
import { H1 } from '@/app/components/ui/h1'
import { CompProps } from '@/app/lib/types'

export const revalidate = 0

type Props = CompProps &
  CategoryKeys & {
    username?: string
  }

export function Heading({ children, ...keys }: Props) {
  const def = getCategoryDef(keys)
  const { name } = def

  return (
    <Stack gap={0}>
      <Stack gap={0}>
        <BackButton to={keys} />
        <H1 className="flex-1 mb-2 mt-0 md:mt-1 text-start">
          {name ?? 'Unknown Category'}
        </H1>
      </Stack>
      {children}
    </Stack>
  )
}
