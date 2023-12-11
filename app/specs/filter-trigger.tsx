'use client'

import { ListFilter } from 'lucide-react'
import { ReactNode, useState } from 'react'
import { Drawer } from 'vaul'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Props = {
  children: ReactNode
}

export function FilterTrigger({ children }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <Drawer.Root open={open} onOpenChange={setOpen}>
      <Drawer.Trigger asChild>
        <Button className="w-11 h-11" variant="link" size="xs">
          <ListFilter className="w-6 h-6" />
        </Button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/50 z-40" />
        <Drawer.Content
          className={cn(
            'fixed bottom-0 left-0 right-0 z-50',
            'grid grid-rows-[max-content_1fr_max-content]',
            'h-full max-h-[90%] gap-2 px-4',
            'bg-popover/50 backdrop-blur border-t border-border/50 rounded-t-xl',
          )}
        >
          <div className="flex flex-shrink-0 items-end justify-center h-9">
            <Drawer.Title className="font-semibold">Filters</Drawer.Title>
          </div>
          <div className="flex flex-1 overflow-auto">{children}</div>
          <div className="flex flex-shrink-0 pb-4 mt-2">
            <Button className="flex-1" size="sm" onClick={() => setOpen(false)}>
              Done
            </Button>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
