import Link from 'next/link'
import { ReactNode } from 'react'

import * as Layout from '@/components/responsive-layout'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { toSpecEdit } from '@/lib/routes'
import { Spec } from '@/lib/types'

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
    <Layout.Root>
      <Layout.Header title={name}>
        {back}
        <Layout.Actions>
          {showEdit && (
            <Link href={editUrl}>
              <Button size="sm">Edit</Button>
            </Link>
          )}
        </Layout.Actions>
      </Layout.Header>
      <Container className="py-8 [--container-w-max:800px]">
        {children}
      </Container>
      <Layout.Footer status={status}>
        <span />
        {showEdit && (
          <Link href={editUrl}>
            <Button className="text-base" variant="ghost">
              Edit
            </Button>
          </Link>
        )}
      </Layout.Footer>
    </Layout.Root>
  )
}
