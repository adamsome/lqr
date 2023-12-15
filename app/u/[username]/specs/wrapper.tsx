import { Pencil2Icon } from '@radix-ui/react-icons'
import Link from 'next/link'
import { ReactNode } from 'react'

import { FooterFilterDrawerButton } from '@/app/u/[username]/specs/footer-filter-drawer-button'
import * as Layout from '@/components/responsive-layout'
import { Button, IconButton } from '@/components/ui/button'
import { FullWidthContainer } from '@/components/ui/container'
import { toCreateSpec, toHome } from '@/lib/routes'
import { User } from '@/lib/types'

type Props = {
  children?: ReactNode
  filters?: ReactNode
  status?: ReactNode
  user?: User
  isCurrentUser?: boolean
}

export function Wrapper({
  children,
  filters,
  status,
  user,
  isCurrentUser,
}: Props) {
  const addUrl = toCreateSpec(user?.username)
  return (
    <Layout.Root>
      <Layout.Header title="Specs">
        <Layout.Back href={toHome(user?.username)} user={user} />
        <Layout.Actions>
          {isCurrentUser && (
            <Link href={addUrl}>
              <Button size="sm">
                <Pencil2Icon />
                <span className="ps-1.5 pe-1">Create</span>
              </Button>
            </Link>
          )}
        </Layout.Actions>
      </Layout.Header>

      <FullWidthContainer className="my-4 sm:my-6 flex flex-col gap-4">
        {children}
      </FullWidthContainer>

      <Layout.Footer status={status}>
        <FooterFilterDrawerButton>{filters}</FooterFilterDrawerButton>
        {isCurrentUser && (
          <Link href={addUrl}>
            <IconButton>
              <Pencil2Icon className="w-6 h-6" />
            </IconButton>
          </Link>
        )}
      </Layout.Footer>
    </Layout.Root>
  )
}
