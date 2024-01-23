import { ArrowDownIcon } from '@radix-ui/react-icons'

import { Level } from '@/app/components/layout/level'

export function DestockSeparator() {
  return (
    <Level className="text-muted-foreground/40 -my-1" gap={4}>
      <div className="flex-1 h-px bg-primary/5" />
      <div className="text-xs uppercase font-bold tracking-wide">
        Not in Stock
      </div>
      <ArrowDownIcon className="-ms-3 w-3 h-3" />
    </Level>
  )
}
