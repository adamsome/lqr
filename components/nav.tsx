import Link from 'next/link'

import Logo from '@/components/logo'

export function Nav() {
  return (
    <div className="flex items-center gap-4 overflow-hidden lg:gap-6">
      <Link
        href="/"
        className="group flex items-center gap-x-2 overflow-hidden"
      >
        <Logo className="flex-none" />
        <span className="inline-block overflow-hidden text-ellipsis whitespace-nowrap font-bold">
          Lqr
        </span>
      </Link>
      <Link
        href="/bar"
        className="group flex items-center gap-x-2 overflow-hidden text-ellipsis whitespace-nowrap font-medium transition-colors hover:text-primary"
      >
        Bar
      </Link>
      <Link
        href="/specs"
        className="group flex items-center gap-x-2 overflow-hidden text-ellipsis whitespace-nowrap font-medium transition-colors hover:text-primary"
      >
        Specs
      </Link>
    </div>
  )
}
