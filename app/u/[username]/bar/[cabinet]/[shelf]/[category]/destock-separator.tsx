import { ArrowDownIcon } from '@radix-ui/react-icons'

import { Level } from '@/app/components/layout/level'

export function DestockSeparator() {
  return (
    <Level className="-my-1 text-muted-foreground/40" gap={4}>
      <div className="h-px flex-1 bg-primary/5" />
      <div className="text-xs font-bold uppercase tracking-wide">
        Not in Stock
      </div>
      <ArrowDownIcon className="-ms-3 h-3 w-3" />
    </Level>
  )
}
