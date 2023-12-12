'use client'

import { UserProfile, useClerk, useUser } from '@clerk/nextjs'
import { Content as DialogContent } from '@radix-ui/react-dialog'
import {
  CardStackIcon,
  CubeIcon,
  ExitIcon,
  HomeIcon,
} from '@radix-ui/react-icons'
import { useRouter } from 'next/navigation'
import { KeyboardEvent, ReactNode, useEffect, useState } from 'react'

import { AppCommandTheme } from '@/app/app-command-theme'
import { GithubIcon } from '@/components/github-icon'
import Logo from '@/components/logo'
import { Button } from '@/components/ui/button'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandIconItem,
  CommandInput,
  CommandList,
} from '@/components/ui/command'
import { Dialog, DialogOverlay, DialogPortal } from '@/components/ui/dialog'
import { UserAvatar } from '@/components/user-avatar'
import { BAR, HOME, SIGN_IN, SIGN_UP, SPECS } from '@/lib/routes'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export function AppCommand() {
  const [open, setOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [value, setValue] = useState(HOME)
  const router = useRouter()
  const { user, isLoaded } = useUser()
  const { signOut } = useClerk()

  useEffect(() => {
    function handleKeydown(e: globalThis.KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') setOpen(true)
    }
    document.addEventListener('keydown', handleKeydown)
    return () => document.removeEventListener('keydown', handleKeydown)
  }, [setOpen])

  if (!isLoaded) return null

  if (!user) {
    return (
      <Sticky>
        <div className="flex items-center gap-2 sm:gap-4">
          <Link className="pt-[0.22rem]" href={SIGN_IN}>
            <Button variant="outline" size="sm">
              Sign In
            </Button>
          </Link>
          <Link className="pt-[0.22rem]" href={SIGN_UP}>
            <Button size="sm">Sign Up</Button>
          </Link>
        </div>
      </Sticky>
    )
  }

  function handleDialogKey(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Escape' || e.key === 'Backspace') {
      e.preventDefault()
      setOpen(false)
    }
  }

  function handleValueChange(value: string) {
    if (value?.startsWith('/')) router.prefetch(value)
    setValue(value)
  }

  const handleSelect =
    (callback: (value: string) => void) => (value: string) => {
      setOpen(false)
      callback(value)
    }

  const handleLink = handleSelect((href) => router.push(href))

  function handleOpenProfile() {
    setOpen(false)
    setProfileOpen(true)
  }

  return (
    <>
      <Sticky>
        <button
          type="button"
          className="rounded-full shadow-md overflow-hidden w-9 h-9 sm:w-11 sm:h-11"
          onClick={() => setOpen(true)}
        >
          <UserAvatar user={user} size="3xl" hideName />
        </button>
      </Sticky>

      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogPortal className="z-50">
          <DialogOverlay />
          <DialogContent
            className={cn(
              'fixed z-50 grid h-[calc(100vh-200px)] gap-4 rounded-2xl overflow-hidden animate-in data-[state=open]:fade-in-90 data-[state=open]:slide-in-from-bottom-10 sm:zoom-in-90 data-[state=open]:sm:slide-in-from-bottom-0',
            )}
          >
            <div className="overflow-auto w-full h-full [&_.cl-card]:mx-0">
              <UserProfile />
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>

      <CommandDialog
        open={open}
        value={value}
        showClose={false}
        onValueChange={handleValueChange}
        onOpenChange={setOpen}
        onKeyDown={handleDialogKey}
      >
        <CommandInput placeholder="Type a command or search..." shortcut="⌘K" />
        <CommandList
          className={cn('h-[404px] max-h-screen overscroll-contain')}
        >
          <CommandEmpty>No items found.</CommandEmpty>
          <CommandGroup heading="Links">
            <CommandIconItem
              name="Home"
              value={HOME}
              icon={<HomeIcon />}
              onSelect={handleLink}
            />
            <CommandIconItem
              name="Specs"
              desc="Cocktail Recipes"
              value={SPECS}
              icon={<CardStackIcon />}
              onSelect={handleLink}
            />
            <CommandIconItem
              name="Bar"
              desc="Bottles & Ingredients"
              value={BAR}
              icon={<CubeIcon />}
              onSelect={handleLink}
            />
            <CommandIconItem
              name="User"
              value="/user-profile"
              onSelect={handleLink}
            />
          </CommandGroup>

          <AppCommandTheme onSelect={() => setOpen(false)} />

          <CommandGroup heading="User">
            <CommandIconItem
              name="Profile"
              icon={<UserAvatar user={user} size="sm" hideName />}
              onSelect={handleOpenProfile}
            />
            <CommandIconItem
              name="Sign Out"
              icon={<ExitIcon />}
              onSelect={() => signOut()}
            />
          </CommandGroup>

          <CommandGroup heading="Author">
            <CommandIconItem
              name="adamsome"
              desc="Author Homepage"
              value="https://adamso.me"
              icon={<Logo className="w-6 h-6 -m-1" />}
              onSelect={(href) => {
                window?.open(href)
                setOpen(false)
              }}
            />
            <CommandIconItem
              name="Github"
              desc="Source Code"
              value="https://www.github.com/adamsome/lqr"
              icon={<GithubIcon className="w-4 h-4" />}
              onSelect={(href) => {
                window?.open(href)
                setOpen(false)
              }}
            />
          </CommandGroup>
        </CommandList>

        <div className="flex items-center justify-between h-10 px-3 border-t">
          <div className="flex items-center gap-2 font-semibold text-muted-foreground">
            <Logo className="w-7 h-7 -m-1.5" body="text-muted-foreground" />
            Lqr
          </div>
          <div className="flex items-center gap-2">
            <Button
              className="flex items-center gap-2 font-semibold"
              variant="ghost"
              size="xs"
              onClick={handleOpenProfile}
            >
              <UserAvatar user={user} size="sm" />
            </Button>
          </div>
        </div>
      </CommandDialog>
    </>
  )
}

function Sticky({ children }: { children: ReactNode }) {
  return (
    <div className="sticky top-0 w-full z-40 [&>*]:absolute [&>*]:top-2 [&>*]:right-2">
      {children}
    </div>
  )
}
