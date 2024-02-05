'use client'

import { useRouter } from 'next/navigation'
import { FC, PropsWithChildren, useCallback, useState } from 'react'

import { Dialog, DialogContent } from '@/app/components/ui/dialog'
import {
  Drawer,
  DrawerContent,
  DrawerHandle,
  DrawerScroller,
} from '@/app/components/ui/drawer'
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
    <Drawer open={open} onOpenChange={handleClose} {...rest}>
      <DrawerContent>
        <DrawerScroller>{children}</DrawerScroller>
        <DrawerHandle />
      </DrawerContent>
    </Drawer>
  )
}
