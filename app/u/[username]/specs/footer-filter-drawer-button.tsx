'use client'

import { ListFilter } from 'lucide-react'
import { ReactNode, useState } from 'react'

import { Level } from '@/app/components/layout/level'
import { Button, IconButton } from '@/app/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from '@/app/components/ui/drawer'

type Props = {
  children: ReactNode
}

export function FooterFilterDrawerButton({ children }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <IconButton>
          <ListFilter className="w-6 h-6" />
        </IconButton>
      </DrawerTrigger>
      <DrawerContent className="grid grid-rows-[max-content_1fr_max-content] gap-2 px-4">
        <Level className="flex-shrink-0 h-9" items="end" justify="center">
          <DrawerTitle className="text-base font-semibold">Filters</DrawerTitle>
        </Level>
        <div className="flex overflow-auto">{children}</div>
        <div className="flex flex-shrink-0 pb-4 mt-2">
          <Button className="flex-1" size="sm" onClick={() => setOpen(false)}>
            Done
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
