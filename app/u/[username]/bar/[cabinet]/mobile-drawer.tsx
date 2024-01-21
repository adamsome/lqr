'use client'

import { useSelectedLayoutSegments } from 'next/navigation'
import { PropsWithChildren } from 'react'

import { getBackKeys } from '@/app/u/[username]/bar/lib/get-back-keys'
import { SidebarLayoutMobileDrawer } from '@/components/layout/sidebar-layout'
import { toBar, toBarCategory } from '@/lib/routes'

type Props = PropsWithChildren<{
  username?: string
  cabinet?: string
}>

export function MobileDrawer({ children, username, cabinet }: Props) {
  const [shelf, category] = useSelectedLayoutSegments()
  const backKeys = category
    ? getBackKeys({ username, cabinet, shelf, category })
    : undefined
  return (
    <SidebarLayoutMobileDrawer
      className="min-h-[40%] max-h-[66.6%]"
      backTo={backKeys && toBarCategory(backKeys)}
      closeTo={toBar(username)}
      route={[cabinet, shelf, category].filter(Boolean).join('_')}
    >
      {children}
    </SidebarLayoutMobileDrawer>
  )
}
