import { auth } from '@clerk/nextjs'
import { PlusIcon } from '@radix-ui/react-icons'
import { ReactNode } from 'react'

import { AddCommand } from '@/app/u/[username]/bar/add-command'
import * as Layout from '@/components/responsive-layout'
import { Container } from '@/components/ui/container'
import { Count } from '@/components/ui/count'
import { toHome } from '@/lib/routes'
import { User } from '@/lib/types'

export const revalidate = 0

type Props = {
  children: ReactNode
  user: User
  stocked: Set<string>
}

export default async function BarLayout({ children, user, stocked }: Props) {
  const { userId: currentUserID } = auth()

  const isCurrentUser = user.id == currentUserID

  const count = stocked.size

  return (
    <Layout.Root>
      <Layout.Header title="Bar">
        <Layout.Back href={toHome(user.username)} user={user} />
        <Layout.Actions>
          {isCurrentUser && (
            <AddCommand size="sm" stocked={stocked}>
              <PlusIcon />
              <span className="ps-1.5 pe-1">Add</span>
            </AddCommand>
          )}
        </Layout.Actions>
      </Layout.Header>

      <Container className="relative py-4 sm:py-6">{children}</Container>

      <Layout.Footer
        status={
          <span>
            <Count count={count} total={count} /> items
          </span>
        }
      >
        <div />
        {isCurrentUser && (
          <AddCommand
            className="w-11 h-11"
            variant="link"
            size="xs"
            stocked={stocked}
          >
            <PlusIcon className="w-6 h-6" />
          </AddCommand>
        )}
      </Layout.Footer>
    </Layout.Root>
  )
}
