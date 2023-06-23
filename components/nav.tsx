import Link from 'next/link'

import Logo from '@/components/logo'
import { BAR, HOME, RESEARCH, SPECS } from '@/lib/routes'
import { ReactNode } from 'react'

export function Nav() {
  return (
    <div className="flex items-center gap-4 overflow-hidden lg:gap-6">
      <Link
        href={HOME}
        className="group flex items-center gap-x-2 overflow-hidden"
      >
        <Logo className="flex-none" />
        <span className="inline-block overflow-hidden text-ellipsis whitespace-nowrap font-bold">
          Lqr
        </span>
      </Link>
      <Item href={SPECS}>Specs</Item>
      <Item href={BAR}>Bar</Item>
      <Item href={RESEARCH}>Research</Item>
    </div>
  )
}

type ItemProps = {
  href: string
  children: ReactNode
}

function Item({ href, children }: ItemProps) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-x-2 overflow-hidden text-ellipsis whitespace-nowrap font-medium transition-colors hover:text-primary"
    >
      {children}
    </Link>
  )
}
