'use client'

import {
  DropdownMenuItem,
  DropdownMenuLabel,
} from '@/app/components/ui/dropdown-menu'
import { toSpecItem } from '@/app/lib/routes'
import type { Spec } from '@/app/lib/types'
import { specUserIDParam } from '@/app/u/[username]/specs/@modal/[id]/change-user/types'
import { useRouter } from 'next/navigation'

type Props = {
  username?: string
  spec: Spec
}

export function MoreMenuContent({ username = '', spec }: Props) {
  const router = useRouter()
  const baseUrl = `${toSpecItem({ id: spec.id, username })}`
  const q = `?${specUserIDParam}=${spec.userID}`
  return (
    <>
      <DropdownMenuLabel>Admin</DropdownMenuLabel>
      <DropdownMenuItem
        onClick={() => router.push(`${baseUrl}/change-user${q}`)}
      >
        Change owner...
      </DropdownMenuItem>
    </>
  )
}
