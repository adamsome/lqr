import {
  CaretRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@radix-ui/react-icons'
import Link from 'next/link'
import { FormEventHandler, ReactNode } from 'react'

import { CategoryKeys } from '@/app/u/[username]/bar/lib/types'
import { Level } from '@/app/components/layout/level'
import { Button, IconButton } from '@/app/components/ui/button'
import { H1 } from '@/app/components/ui/h1'
import { H2 } from '@/app/components/ui/h2'
import { toBarCategory } from '@/app/lib/routes'
import { CompProps } from '@/app/lib/types'
import { cn } from '@/app/lib/utils'

type Props = CompProps & {
  to: CategoryKeys & { username?: string }
  collapse?: boolean
  size?: 'md' | 'lg'
  onClick: FormEventHandler<HTMLButtonElement>
}

export function HeadingLink({
  children,
  className,
  to,
  collapse,
  size = 'md',
  onClick,
}: Props) {
  const Heading = size == 'md' ? H2 : HeadingLg
  return (
    <Level
      className={cn('isolate relative -me-2', className)}
      justify="between"
    >
      <Link
        className="z-10 text-start overflow-hidden"
        href={toBarCategory(to)}
      >
        <Button className="p-0 h-auto hover:text-foreground/80" variant="link">
          <Heading>
            <Level gap={0}>
              {children}
              <CaretRightIcon
                className={cn(
                  'relative top-px w-7 h-7',
                  size === 'lg' && 'w-8 h-8',
                )}
              />
            </Level>
          </Heading>
        </Button>
      </Link>
      <IconButton
        className="px-1 h-6 w-6 before:absolute before:inset-0 before:z-0"
        onClick={onClick}
      >
        {collapse ? <ChevronUpIcon /> : <ChevronDownIcon />}
      </IconButton>
    </Level>
  )
}

function HeadingLg(props: { children: ReactNode }) {
  return <H1 className="text-xl sm:text-2xl md:text-2xl" {...props} />
}
