'use client'

import { useSelectedLayoutSegments } from 'next/navigation'
import { PropsWithChildren } from 'react'

import { SidebarLayoutMobileDrawer } from '@/components/layout/sidebar-layout'
import { toBar } from '@/lib/routes'

type Props = PropsWithChildren<{
  username?: string
  cabinet?: string
}>

export function MobileDrawer({ children, username, cabinet }: Props) {
  const [shelf, category] = useSelectedLayoutSegments()
  return (
    <SidebarLayoutMobileDrawer
      className="min-h-[40%] max-h-[66.6%]"
      backTo={!category && toBar(username)}
      keepOpenOnBack={!!category}
      route={[cabinet, shelf, category].filter(Boolean).join('_')}
    >
      {children}
    </SidebarLayoutMobileDrawer>
  )
}
