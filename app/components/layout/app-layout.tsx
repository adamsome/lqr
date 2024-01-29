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

import {
  Container,
  FullWidthContainer,
} from '@/app/components/layout/container'
import { Level } from '@/app/components/layout/level'
import { Button } from '@/app/components/ui/button'
import { H2 } from '@/app/components/ui/h2'
import { UserAvatar } from '@/app/components/user/user-avatar'
import { CompProps, User } from '@/app/lib/types'
import { cn } from '@/app/lib/utils'

const Context = createContext({ scrolled: false })

type Props = CompProps & {
  scrolledPx?: number
}

export function AppLayout({ children, className, scrolledPx = 50 }: Props) {
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
          'isolate [--h-sticky:3.25rem] sm:[--h-sticky:3.75rem] [--px:theme(spacing.2)]',
          className,
        )}
      >
        {children}
      </div>
    </Context.Provider>
  )
}

type HeaderProps = CompProps & {
  title?: ReactNode
}

export function AppHeader({ children, className, title }: HeaderProps) {
  const { scrolled } = useContext(Context)
  return (
    <header
      className={cn(
        'z-30 sticky top-0 grid w-full place-content-center',
        'grid-cols-[var(--px)_1fr_var(--px)] grid-rows-1 [&>*]:row-[1]',
        'h-[var(--h-sticky)] border-b border-transparent transition-colors',
        scrolled && 'border-border/40',
        className,
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
            scrolled && 'opacity-100',
          )}
        >
          <H2 className="overflow-hidden whitespace-nowrap text-ellipsis">
            {title}
          </H2>
        </div>
      )}
      {children && (
        <Level className="relative justify-between w-full col-[2]" gap={4}>
          {children}
        </Level>
      )}
    </header>
  )
}

type BackProps = CompProps & {
  href: string
  user?: User | null
}

export function AppBack({ children, className, href, user }: BackProps) {
  const { scrolled } = useContext(Context)
  return (
    <Link className={className} href={href}>
      <Button className="px-1" variant="ghost" size="sm">
        <CaretLeftIcon className="w-6 h-6 -me-0.5" />
        <UserAvatar className="pr-2.5" user={user} hideName={scrolled} />
        {children}
      </Button>
    </Link>
  )
}

export function AppActions({ children, className }: CompProps) {
  const { isSignedIn } = useAuth()
  return (
    <div
      className={cn('me-16 hidden sm:block', !isSignedIn && 'me-48', className)}
    >
      {children}
    </div>
  )
}

export function AppContent({ children, className }: CompProps) {
  return (
    <Container className={cn('pt-4 pb-20 md:py-6', className)}>
      {children}
    </Container>
  )
}

export function AppFullWidthContent({ children, className }: CompProps) {
  return (
    <FullWidthContainer className={cn('py-4 pb-20 md:py-6', className)}>
      {children}
    </FullWidthContainer>
  )
}

type FooterProps = CompProps & {
  status?: ReactNode
}

export function AppFooter({ children, className, status }: FooterProps) {
  return (
    <footer
      className={cn(
        'fixed bottom-0 grid w-full place-content-center',
        'grid-cols-[var(--px)_1fr_var(--px)] grid-rows-1 [&>*]:row-[1]',
        'h-14 pb-0 z-30 sm:hidden',
        'border-t border-border/40',
        className,
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
        <Level
          className={cn(
            'relative justify-self-center col-[2]',
            'text-sm text-muted-foreground',
          )}
          items="center"
          justify="center"
        >
          {status}
        </Level>
      )}
      {children && (
        <Level className="relative justify-between w-full col-[2]" gap={4}>
          {children}
        </Level>
      )}
    </footer>
  )
}
