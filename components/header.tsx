import Link from 'next/link'

import { Icons } from '@/components/icons'
import { Nav } from '@/components/nav'
import { ModeToggle } from '@/components/theme-toggle'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Container } from '@/components/ui/container'

export function Header() {
  return (
    <header className="supports-backdrop-blur:bg-background/60 sticky top-0 z-40 w-full border-b bg-background/95 shadow-sm backdrop-blur">
      <Container>
        <div className="flex h-14 items-center gap-x-2">
          <Nav />
          <nav className="flex flex-1 items-center justify-end gap-x-1">
            <Link
              href="https://www.github.com/adamsome/lqr"
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={cn(
                  buttonVariants({
                    size: 'sm',
                    variant: 'ghost',
                  }),
                  'w-9 px-0'
                )}
              >
                <Icons.gitHub className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </div>
            </Link>
            <ModeToggle />
          </nav>
        </div>
      </Container>
    </header>
  )
}
