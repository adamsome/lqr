import { Pencil2Icon } from '@radix-ui/react-icons'
import Link from 'next/link'
import { ReactNode } from 'react'

import { FooterFilterDrawerButton } from '@/app/u/[username]/specs/footer-filter-drawer-button'
import * as Layout from '@/components/responsive-layout'
import { Button, IconButton } from '@/components/ui/button'
import { FullWidthContainer } from '@/components/ui/container'
import { UserAvatar } from '@/components/user-avatar'
import { toCreateSpec, toHome } from '@/lib/routes'
import { User } from '@/lib/types'

type Props = {
  children?: ReactNode
  header: ReactNode
  toolbar: ReactNode
  filters?: ReactNode
  status?: ReactNode
  user: User
  currentUser?: User | null
}

export function Specs({
  children,
  header,
  toolbar,
  filters,
  status,
  user,
  currentUser,
}: Props) {
  const isCurrentUser = user.id === currentUser?.id
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

      <FullWidthContainer className="my-4 sm:my-6 flex flex-col gap-4">
        {header}
        <div className="flex flex-col gap-3">
          {toolbar}
          <div className="flex gap-6">
            <div className="hidden sm:flex">{filters}</div>
            <div className="flex flex-1 flex-col gap-4 w-full">{children}</div>
          </div>
        </div>
      </FullWidthContainer>

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
