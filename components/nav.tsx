import Link from 'next/link'

import Logo from '@/components/logo'
import { HOME, RESEARCH, SPECS } from '@/lib/routes'

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
      <Link
        href={SPECS}
        className="group flex items-center gap-x-2 overflow-hidden text-ellipsis whitespace-nowrap font-medium transition-colors hover:text-primary"
      >
        Specs
      </Link>
      <Link
        href={RESEARCH}
        className="group flex items-center gap-x-2 overflow-hidden text-ellipsis whitespace-nowrap font-medium transition-colors hover:text-primary"
      >
        Research
      </Link>
    </div>
  )
}
