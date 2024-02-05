import {
  CaretRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@radix-ui/react-icons'
import Link from 'next/link'
import { FormEventHandler, ReactNode } from 'react'

import { Level } from '@/app/components/layout/level'
import { Button, IconButton } from '@/app/components/ui/button'
import { H1 } from '@/app/components/ui/h1'
import { H2 } from '@/app/components/ui/h2'
import {
  LINK_BOX_CLASSNAME,
  LINK_BOX_LINK_CLASSNAME,
} from '@/app/components/ui/link-box'
import { toBarCategory } from '@/app/lib/routes'
import { CompProps } from '@/app/lib/types'
import { cn } from '@/app/lib/utils'
import { CategoryKeys } from '@/app/u/[username]/bar/lib/types'

type Props = CompProps & {
  buttonClassName?: string
  to: CategoryKeys & { username?: string }
  collapse?: boolean
  size?: 'md' | 'lg'
  onClick: FormEventHandler<HTMLButtonElement>
}

export function HeadingLink({
  children,
  className,
  buttonClassName,
  to,
  collapse,
  size = 'md',
  onClick,
}: Props) {
  const Heading = size == 'md' ? H2 : HeadingLg
  return (
    <Level
      className={cn('-me-2', LINK_BOX_CLASSNAME, className)}
      justify="between"
    >
      <Link
        className="z-10 text-start overflow-hidden"
        href={toBarCategory(to)}
      >
        <Button className={cn('p-0 h-auto', buttonClassName)} variant="link">
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
        className={cn('px-1 h-6 w-6', LINK_BOX_LINK_CLASSNAME)}
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
