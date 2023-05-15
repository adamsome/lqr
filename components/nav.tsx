import Link from 'next/link'

import Logo from '@/components/logo'

export function Nav() {
  return (
    <div className="flex overflow-hidden">
      <Link
        href="/"
        className="group flex items-center gap-x-2 overflow-hidden"
      >
        <Logo className="flex-none" />
        <span className="inline-block overflow-hidden text-ellipsis whitespace-nowrap font-bold">
          Lqr
        </span>
      </Link>
    </div>
  )
}
