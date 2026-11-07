import { ChevronLeftIcon } from '@radix-ui/react-icons'
import Link from 'next/link'

import { getCabinetDef, getShelfDef } from '@/app/u/[username]/bar/lib/defs'
import { getBackKeys } from '@/app/u/[username]/bar/lib/get-back-keys'
import { CategoryKeys } from '@/app/u/[username]/bar/lib/types'
import { Level } from '@/app/components/layout/level'
import { Button } from '@/app/components/ui/button'
import { toBarCategory } from '@/app/lib/routes'
import { cn } from '@/app/lib/utils'

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
      className={cn('-ms-2.5 mb-1.5 w-max md:-my-2 md:-ms-4.5', className)}
      href={toBarCategory(backKeys)}
    >
      <Button
        className={cn(
          'h-auto justify-start p-[5px] md:h-auto md:w-full',
          'text-accent-muted dark:md:text-secondary-foreground',
          'font-bold hover:text-secondary-foreground md:hover:text-secondary-foreground',
          'bg-secondary md:bg-transparent',
          'hover:bg-secondary/80 md:hover:bg-transparent',
          'backdrop-blur-md md:backdrop-blur-none',
          'rounded-full transition-colors md:rounded-none',
        )}
        variant="link"
      >
        <Level className="justify-center md:justify-start" gap={0.5}>
          <ChevronLeftIcon className="h-4.5 w-4.5" />
          <span className="hidden md:inline">{name}</span>
        </Level>
      </Button>
    </Link>
  )
}
