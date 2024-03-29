'use client'

import { ReactNode, useState } from 'react'

import { HeadingLink } from '@/app/u/[username]/bar/components/heading-link'
import { getShelfDef } from '@/app/u/[username]/bar/lib/defs'
import { CategoryKeys } from '@/app/u/[username]/bar/lib/types'
import { Container } from '@/app/components/layout/container'
import { Stack } from '@/app/components/layout/stack'
import { H1 } from '@/app/components/ui/h1'
import { CompProps } from '@/app/lib/types'
import { cn } from '@/app/lib/utils'

export const revalidate = 0

type Props = CompProps &
  CategoryKeys & {
    username?: string
    backButton?: ReactNode
    asLink?: boolean
  }

export function Heading({
  children,
  className,
  backButton,
  asLink,
  ...keys
}: Props) {
  const [collapse, setCollapse] = useState(false)

  const def = getShelfDef(keys)
  const { name } = def

  return (
    <Stack
      className={cn(!collapse && 'border-b-2 border-b-primary/5', className)}
      gap={3}
    >
      <Container
        className="gap-y-1 sm:gap-y-1 mt-[41px] md:mt-0"
        pad="unresponsive"
      >
        {backButton}
        {asLink ? (
          <HeadingLink
            buttonClassName="text-foreground"
            to={keys}
            size="lg"
            collapse={collapse}
            onClick={() => setCollapse((value) => !value)}
          >
            {name}
          </HeadingLink>
        ) : (
          <H1>{name}</H1>
        )}
      </Container>
      {!collapse && children}
    </Stack>
  )
}
