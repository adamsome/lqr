'use client'

import { DialogProps } from '@radix-ui/react-dialog'
import { useRouter } from 'next/navigation'
import { ReactNode, useCallback, useEffect, useState } from 'react'
import { Drawer } from 'vaul'

import { FullWidthContainer } from '@/components/layout/container'
import { useAboveBreakpoint } from '@/components/ui/use-above-breakpoint'
import { useIsMounted } from '@/hooks/use-is-mounted'
import { CompProps } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Cross1Icon } from '@radix-ui/react-icons'

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
        <Column className="pt-[var(--h-sticky)]">
          <FullWidthContainer className={cn('pe-3 sm:pe-3')}>
            {sidebar}
          </FullWidthContainer>
        </Column>
        <Column className="md:pt-[var(--h-sticky)]">
          <FullWidthContainer className="ps-2 sm:ps-3 h-full">
            {children}
          </FullWidthContainer>
        </Column>
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
    keepOpenOnBack?: boolean
  }

export function SidebarLayoutMobileDrawer({
  children,
  className,
  backTo,
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

  const handleClose = useCallback(
    (open: boolean) => {
      if (open) return
      if (!keepOpenOnBack) setOpen(false)
      backTo ? router.push(backTo, { scroll: false }) : router.back()
    },
    [router, backTo, keepOpenOnBack],
  )

  return (
    <>
      <div className="hidden md:block">{children}</div>
      <Drawer.Root
        open={open && mounted && !isAboveMd}
        onOpenChange={handleClose}
        {...rest}
      >
        <Drawer.Portal>
          <Drawer.Overlay className="z-40 fixed inset-0 bg-background/60 transition-all duration-100" />
          <Drawer.Content
            className={cn(
              'z-50 fixed bottom-0 left-0 right-0 flex flex-col gap-2 -mx-px max-h-[90%] bg-popover/50 backdrop-blur-md border border-b-0 border-border/50 rounded-t-2xl overflow-clip',
              className,
            )}
          >
            <div className="flex-1 py-1.5 overflow-auto backdrop-blur [mask-image:linear-gradient(to_bottom,transparent,rgb(255_255_255_/_50%)_6px,white_20px,white)]">
              {children}
            </div>
            <div className="z-10 absolute top-0 left-0 right-0 mt-2 mx-auto w-12 h-1 rounded-full bg-muted-foreground/40 backdrop-blur-md" />
            <Drawer.Close className="z-10 absolute right-1.5 top-1.5 p-[6px] bg-muted/60 hover:bg-muted/80 text-muted-foreground/60 rounded-full backdrop-blur-md shadow transition-colors disabled:pointer-events-none">
              <Cross1Icon stroke="2px" />
              <span className="sr-only">Close</span>
            </Drawer.Close>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </>
  )
}
