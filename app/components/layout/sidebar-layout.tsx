'use client'

import { DialogProps } from '@radix-ui/react-dialog'
import { useRouter } from 'next/navigation'
import { ReactNode, useEffect, useState } from 'react'

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHandle,
  DrawerScroller,
} from '@/app/components/ui/drawer'
import { useAboveBreakpoint } from '@/app/components/ui/use-above-breakpoint'
import { useIsMounted } from '@/app/components/ui/use-is-mounted'
import { CompProps } from '@/app/lib/types'
import { cn } from '@/app/lib/utils'

type ContentWithSidebarProps = CompProps & {
  sidebar: ReactNode
  sidebarClassName?: string
  border?: string | null
}

export function SidebarLayout({
  children,
  className,
  sidebar,
}: ContentWithSidebarProps) {
  return (
    <div className="isolate relative -top-[var(--h-sticky)] -mb-[var(--h-sticky)] min-h-screen">
      <div
        className={cn(
          'md:grid md:flex-1 md:h-screen md:overflow-auto',
          'md:grid-cols-[min(theme(spacing.112),50%)_1fr]',
          'lg:grid-cols-[theme(spacing.112)_1fr]',
          className,
        )}
      >
        <Column className="pt-[var(--h-sticky)]">{sidebar}</Column>
        <Column className="md:pt-[var(--h-sticky)]">{children}</Column>
      </div>
    </div>
  )
}

function Column({ children, className }: CompProps) {
  return (
    <div className={cn('md:overflow-y-auto md:overflow-x-clip', className)}>
      {children}
    </div>
  )
}

type MobileDrawerProps = CompProps &
  DialogProps & {
    route?: string
    backTo?: string | null | false
    closeTo?: string | null | false
    keepOpenOnBack?: boolean
  }

export function SidebarLayoutMobileDrawer({
  children,
  className,
  backTo,
  closeTo,
  route,
  keepOpenOnBack,
  ...rest
}: MobileDrawerProps) {
  const isAboveMd = useAboveBreakpoint('md', true)
  const router = useRouter()
  const [open, setOpen] = useState(true)
  const mounted = useIsMounted()

  useEffect(() => {
    if (route) setOpen(true)
  }, [route])

  return (
    <>
      <div className="hidden md:block">{children}</div>
      <Drawer
        open={open && mounted && !isAboveMd}
        onOpenChange={(open) => {
          if (open) return
          setOpen(false)
          closeTo ? router.push(closeTo, { scroll: false }) : router.back()
        }}
        {...rest}
      >
        <DrawerContent
          className={className}
          onPointerDownOutside={(e) => {
            if (!open || !backTo || backTo === closeTo) return
            e.preventDefault()
            router.push(backTo, { scroll: false })
          }}
        >
          <DrawerScroller>{children}</DrawerScroller>
          <DrawerHandle />
          <DrawerClose />
        </DrawerContent>
      </Drawer>
    </>
  )
}
