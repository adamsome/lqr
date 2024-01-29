import Link from 'next/link'
import { ReactNode } from 'react'

import {
  AppActions,
  AppContent,
  AppFooter,
  AppHeader,
  AppLayout,
} from '@/app/components/layout/app-layout'
import { Container } from '@/app/components/layout/container'
import { Button } from '@/app/components/ui/button'
import { toSpecEdit } from '@/app/lib/routes'
import { Spec } from '@/app/lib/types'

type Props = {
  children: ReactNode
  back: ReactNode
  status: ReactNode
  spec: Spec
  showEdit?: boolean
}

export function SpecLayout({ children, back, spec, status, showEdit }: Props) {
  const { id, name, username, updatedAt } = spec
  const editUrl = toSpecEdit(username, id)
  return (
    <AppLayout>
      <AppHeader title={name}>
        {back}
        <AppActions>
          {showEdit && (
            <Link href={editUrl}>
              <Button size="sm">Edit</Button>
            </Link>
          )}
        </AppActions>
      </AppHeader>
      <AppContent className="pt-8 md:pt-8 [--container-w-max:800px]">
        {children}
      </AppContent>
      <AppFooter status={status}>
        <span />
        {showEdit && (
          <Link href={editUrl}>
            <Button className="text-base" variant="ghost">
              Edit
            </Button>
          </Link>
        )}
      </AppFooter>
    </AppLayout>
  )
}
