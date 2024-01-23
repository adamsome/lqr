'use client'

import { useRouter } from 'next/navigation'
import { FC, PropsWithChildren, useCallback, useState } from 'react'
import { Drawer } from 'vaul'

import { Dialog, DialogContent } from '@/app/components/ui/dialog'
import { useAboveBreakpoint } from '@/app/components/ui/use-above-breakpoint'
import { DialogProps } from '@radix-ui/react-dialog'

type Props = PropsWithChildren<DialogProps> & {
  showDialogAboveMd?: boolean
  AboveMdWrapper?: FC<PropsWithChildren<DialogProps>>
}

export default function RouteDialog({
  children,
  showDialogAboveMd,
  ...rest
}: Props) {
  const isAboveMd = useAboveBreakpoint('md')
  const router = useRouter()
  const [open, setOpen] = useState(true)

  const handleClose = useCallback(
    (open: boolean) => {
      if (open) return
      setOpen(false)
      router.back()
    },
    [router],
  )

  if (isAboveMd) {
    if (!showDialogAboveMd) return <>{children}</>
    return (
      <Dialog open={open} onOpenChange={handleClose} {...rest}>
        <DialogContent showClose bottom>
          {children}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer.Root open={open} onOpenChange={handleClose} {...rest}>
      <Drawer.Portal>
        <Drawer.Overlay className="z-40 fixed inset-0 bg-black/40 backdrop-blur" />
        <Drawer.Content className="z-50 fixed bottom-0 left-0 right-0 flex flex-col gap-2 -mx-px mt-24 bg-popover/50 backdrop-blur border border-b-0 border-border/50 rounded-t-xl">
          <div className="flex-shrink-0 mx-auto w-12 h-1 rounded-full bg-primary/20 mt-2" />
          <div className="flex-1">{children}</div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
