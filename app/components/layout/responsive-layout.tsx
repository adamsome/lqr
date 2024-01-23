'use client'

import { useAuth } from '@clerk/nextjs'
import { CaretLeftIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'

import { Button } from '@/app/components/ui/button'
import { H2 } from '@/app/components/ui/h2'
import { UserAvatar } from '@/app/components/user/user-avatar'
import { User } from '@/app/lib/types'
import { cn } from '@/app/lib/utils'

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
          '[--h-header:3.25rem] sm:[--h-header:3.75rem]',
          'relative min-h-screen overflow-x-clip [--px:theme(spacing.2)]',
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
        'z-30 sticky top-0 grid w-full place-content-center',
        'grid-cols-[var(--px)_1fr_var(--px)] grid-rows-1 [&>*]:row-[1]',
        'h-[var(--h-header)] border-b border-transparent transition-colors',
        { 'border-border/40': scrolled },
      )}
    >
      <div
        className={cn(
          'absolute inset-0 col-span-full pointer-events-none',
          '[--extend:theme(spacing.32)] bottom-[calc(-1*var(--extend))]',
          '[--cutoff:calc(100%-var(--extend))]',
          '[-webkit-mask-image:linear-gradient(to_bottom,black_0,black_var(--cutoff),transparent_var(--cutoff))]',
          'backdrop-blur-lg',
        )}
      />
      {title && (
        <div
          className={cn(
            'relative flex items-center justify-center justify-self-center',
            'max-w-[calc(100%-theme(spacing.28))] col-[2]',
            'opacity-0 transition-opacity',
            { 'opacity-100': scrolled },
          )}
        >
          <H2 className="overflow-hidden whitespace-nowrap text-ellipsis">
            {title}
          </H2>
        </div>
      )}
      {children && (
        <Level className="relative justify-between col-[2]">{children}</Level>
      )}
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
        'grid-cols-[var(--px)_1fr_var(--px)] grid-rows-1 [&>*]:row-[1]',
        'h-14 pb-0 z-30 sm:hidden',
        'border-t border-border/40',
      )}
    >
      <div
        className={cn(
          'absolute inset-0 col-span-full pointer-events-none',
          '[--extend:theme(spacing.32)] top-[calc(-1*var(--extend))]',
          '[--cutoff:calc(100%-var(--extend))]',
          '[-webkit-mask-image:linear-gradient(to_top,black_0,black_var(--cutoff),transparent_var(--cutoff))]',
          'backdrop-blur-lg',
        )}
      />
      {status && (
        <div
          className={cn(
            'relative flex items-center justify-center justify-self-center col-[2]',
            'text-sm text-muted-foreground',
          )}
        >
          {status}
        </div>
      )}
      {children && (
        <Level className="relative col-[2] justify-between">{children}</Level>
      )}
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

export { Actions, Back, Footer, Header, Root }
