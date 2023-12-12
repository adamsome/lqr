'use client'

import { CaretLeftIcon, GearIcon, PlusIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'

import { Button } from '@/components/ui/button'
import { H2 } from '@/components/ui/h2'
import { cn } from '@/lib/utils'
import { UserAvatar } from '@/components/user-avatar'
import { User } from '@/lib/types'
import { useAuth } from '@clerk/nextjs'

const Context = createContext({ scrolled: false })

type Props = {
  children: ReactNode
  className?: string
  scrolledPx?: number
}

function Root({ children, className, scrolledPx = 50 }: Props) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    window.addEventListener('scroll', () =>
      setScrolled(window.scrollY > scrolledPx),
    )
    return () => window.removeEventListener('scroll', () => {})
  }, [scrolledPx])

  return (
    <Context.Provider value={{ scrolled }}>
      <div
        className={cn(
          'relative pb-16 min-h-screen overflow-x-clip [--px:theme(spacing.2)]',
          className,
        )}
      >
        {children}
      </div>
    </Context.Provider>
  )
}

type HeaderProps = {
  children?: ReactNode
  title?: ReactNode
}

function Header({ children, title }: HeaderProps) {
  const { scrolled } = useContext(Context)
  return (
    <header
      className={cn(
        'sticky top-0 grid w-full place-content-center',
        'grid-cols-[var(--px)_1fr_var(--px)] [&>*]:[grid-area:2/2]',
        'h-[3.25rem] sm:h-[3.75rem] z-30',
        'backdrop-blur border-b border-transparent transition-colors',
        { 'border-border/4': scrolled },
      )}
    >
      {title && (
        <div
          className={cn(
            'flex items-center justify-center justify-self-center',
            'max-w-[calc(100%-theme(spacing.28))]',
            'opacity-0 transition-opacity',
            { 'opacity-100': scrolled },
          )}
        >
          <H2 className="overflow-hidden whitespace-nowrap text-ellipsis">
            {title}
          </H2>
        </div>
      )}
      {children && <Level className="justify-between">{children}</Level>}
    </header>
  )
}

type BackProps = {
  href: string
  user?: User | null
  children?: ReactNode
}

function Back({ children, href, user }: BackProps) {
  const { scrolled } = useContext(Context)
  return (
    <Link href={href}>
      <Button className="px-1" variant="ghost" size="sm">
        <CaretLeftIcon className="w-6 h-6 -me-0.5" />
        <UserAvatar className="pr-2.5" user={user} hideName={scrolled} />
        {children}
      </Button>
    </Link>
  )
}

function Actions({ children }: Props) {
  const { isSignedIn } = useAuth()
  return (
    <div className={cn('me-16 hidden sm:block', { 'me-48': !isSignedIn })}>
      {children}
    </div>
  )
}

type FooterProps = {
  children?: ReactNode
  status?: ReactNode
}

function Footer({ children, status }: FooterProps) {
  return (
    <footer
      className={cn(
        'fixed bottom-0 grid w-full place-content-center',
        // 'grid-cols-[1fr] [&>*]:[grid-area:1/1]',
        'grid-cols-[var(--px)_1fr_var(--px)] [&>*]:[grid-area:2/2]',
        'h-16 pb-4 z-30',
        'backdrop-blur border-t border-transparent transition-colors',
        'border-border/40 sm:hidden',
      )}
    >
      {status && (
        <div className="flex items-center justify-center justify-self-center text-sm text-muted-foreground">
          {status}
        </div>
      )}
      {children && <Level className="justify-between">{children}</Level>}
    </footer>
  )
}

function Level({ children, className }: Props) {
  return (
    <div className={cn('flex items-center w-full gap-4', className)}>
      {children}
    </div>
  )
}

export { Actions, Header, Back, Root, Footer }
