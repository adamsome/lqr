'use client'

import { useRouter } from 'next/navigation'
import { ReactNode, useCallback } from 'react'

import { Dialog, DialogContent } from '@/components/ui/dialog'

type Props = {
  children: ReactNode
}

export default function InterceptRouteDialog({ children }: Props) {
  const router = useRouter()

  const handleClose = useCallback(() => {
    router.back()
  }, [router])

  return (
    <Dialog defaultOpen onOpenChange={(open) => !open && handleClose()}>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  )
}
