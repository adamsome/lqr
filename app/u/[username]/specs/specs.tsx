import { Pencil2Icon } from '@radix-ui/react-icons'
import Link from 'next/link'
import { ReactNode } from 'react'

import {
  AppActions,
  AppBack,
  AppFullWidthContent,
  AppFooter,
  AppHeader,
  AppLayout,
} from '@/app/components/layout/app-layout'
import { Button, IconButton } from '@/app/components/ui/button'
import { UserAvatar } from '@/app/components/user/user-avatar'
import { getCurrentUser } from '@/app/lib/model/user'
import { toCreateSpec, toHome } from '@/app/lib/routes'
import { FooterFilterDrawerButton } from '@/app/u/[username]/specs/footer-filter-drawer-button'
import { isAdmin } from '@/app/lib/model/admin'

type Props = {
  children?: ReactNode
  header: ReactNode
  title?: ReactNode
  toolbar: ReactNode
  filters?: ReactNode
  sidebar?: ReactNode
  status?: ReactNode
  username?: string
}

export async function Specs({
  children,
  header,
  title,
  toolbar,
  filters,
  sidebar,
  status,
  username,
}: Props) {
  const { user, currentUser, isCurrentUser } = await getCurrentUser(username)
  const showCreate = username && (isCurrentUser || isAdmin(currentUser?.id))
  const addUrl = toCreateSpec(user?.username)
  return (
    <AppLayout>
      <AppHeader title={title ?? <UserAvatar user={user} />}>
        {!isCurrentUser ? (
          <AppBack href={toHome(currentUser?.username)} user={currentUser} />
        ) : (
          <div />
        )}
        <AppActions>
          {showCreate && (
            <Link href={addUrl}>
              <Button size="sm">
                <Pencil2Icon />
                <span className="pe-1 ps-1.5">Create</span>
              </Button>
            </Link>
          )}
        </AppActions>
      </AppHeader>

      <div className="flex">
        <AppFullWidthContent className="flex w-full flex-1 flex-col gap-y-5 sm:gap-y-6">
          {header}
          <div className="flex flex-col gap-4 sm:gap-5">
            {toolbar}
            <div className="flex gap-6">
              <div className="hidden sm:flex">{filters}</div>
              <div className="flex w-full flex-1 flex-col gap-4">
                {children}
              </div>
            </div>
          </div>
        </AppFullWidthContent>
        {sidebar}
      </div>

      <AppFooter status={status}>
        <FooterFilterDrawerButton>
          <div className="flex w-full">{filters}</div>
        </FooterFilterDrawerButton>
        {showCreate && (
          <Link href={addUrl}>
            <IconButton>
              <Pencil2Icon className="h-6 w-6" />
            </IconButton>
          </Link>
        )}
      </AppFooter>
    </AppLayout>
  )
}
