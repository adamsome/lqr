import { ChevronLeftIcon } from '@radix-ui/react-icons'
import Link from 'next/link'

import { getCabinetDef, getShelfDef } from '@/app/u/[username]/bar/lib/defs'
import { getBackKeys } from '@/app/u/[username]/bar/lib/get-back-keys'
import { CategoryKeys } from '@/app/u/[username]/bar/lib/types'
import { Level } from '@/components/layout/level'
import { Button } from '@/components/ui/button'
import { toBarCategory } from '@/lib/routes'
import { cn } from '@/lib/utils'

function getName(keys: CategoryKeys) {
  if (keys.shelf) return getShelfDef(keys).name
  if (keys.cabinet) return getCabinetDef(keys).name
  return 'Full Bar'
}

type Props = {
  className?: string
  to: CategoryKeys & { username?: string }
  backSteps?: 1 | 2
}

export function BackButton({ className, to, backSteps = 1 }: Props) {
  let backKeys = getBackKeys(to)
  if (backSteps === 2) backKeys = getBackKeys(backKeys)
  const name = getName(backKeys)
  return (
    <Link
      className={cn('-ms-2.5 md:-ms-4.5 my-1.5 md:-my-2 w-max', className)}
      href={toBarCategory(backKeys)}
    >
      <Button
        className="justify-start p-[5px] h-auto md:w-full md:h-auto text-muted-foreground/60 md:text-muted-foreground hover:text-foreground/80 font-bold bg-muted/60 hover:bg-muted/80 md:bg-transparent md:hover:bg-transparent backdrop-blur-md md:backdrop-blur-none rounded-full md:rounded-none transition-colors"
        variant="link"
      >
        <Level className="justify-center md:justify-start" gap={0.5}>
          <ChevronLeftIcon className="w-4.5 h-4.5" />
          <span className="hidden md:inline">{name}</span>
        </Level>
      </Button>
    </Link>
  )
}
