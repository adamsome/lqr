import { Pencil2Icon } from '@radix-ui/react-icons'
import Link from 'next/link'
import { ReactNode } from 'react'

import { FooterFilterDrawerButton } from '@/app/u/[username]/specs/footer-filter-drawer-button'
import { Container } from '@/components/layout/container'
import * as Layout from '@/components/layout/responsive-layout'
import { Button, IconButton } from '@/components/ui/button'
import { H2 } from '@/components/ui/h2'
import { UserAvatar } from '@/components/user-avatar'
import { getCurrentUser } from '@/lib/model/user'
import { toCreateSpec, toHome } from '@/lib/routes'

type Props = {
  children?: ReactNode
  header: ReactNode
  toolbar: ReactNode
  filters?: ReactNode
  sidebar?: ReactNode
  status?: ReactNode
  username?: string
}

export async function Specs({
  children,
  header,
  toolbar,
  filters,
  sidebar,
  status,
  username,
}: Props) {
  const { user, currentUser, isCurrentUser } = await getCurrentUser(username)
  const addUrl = toCreateSpec(user?.username)
  return (
    <Layout.Root>
      <Layout.Header title={<UserAvatar user={user} />}>
        {!isCurrentUser ? (
          <Layout.Back
            href={toHome(currentUser?.username)}
            user={currentUser}
          />
        ) : (
          <div />
        )}
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

      <div className="flex">
        <Container className="flex-1 w-full my-4 sm:my-6 gap-y-5 sm:gap-y-6">
          {header}
          <div className="flex flex-col gap-4 sm:gap-5">
            {toolbar}
            <div className="flex gap-6">
              <div className="hidden sm:flex">{filters}</div>
              <div className="flex flex-1 flex-col gap-4 w-full">
                {children}
              </div>
            </div>
          </div>
        </Container>
        {sidebar ? (
          <div className="hidden lg:flex flex-col gap-2 ps-2 pe-6 mt-14">
            <H2 className="text-muted-foreground">Users to Follow</H2>
            {sidebar}
          </div>
        ) : null}
      </div>

      <Layout.Footer status={status}>
        <FooterFilterDrawerButton>
          <div className="flex w-full">{filters}</div>
        </FooterFilterDrawerButton>
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
