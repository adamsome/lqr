import type { ReactNode } from 'react'

import RouteDialog from '@/app/components/layout/route-dialog'

type Props = {
  children: ReactNode
}

export default function Layout({ children }: Props) {
  return <RouteDialog showDialogAboveMd>{children}</RouteDialog>
}
