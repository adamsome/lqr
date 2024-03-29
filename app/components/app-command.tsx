'use client'

import { UserProfile, useClerk } from '@clerk/nextjs'
import { Content as DialogContent } from '@radix-ui/react-dialog'
import {
  AvatarIcon,
  CardStackIcon,
  CubeIcon,
  ExitIcon,
} from '@radix-ui/react-icons'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { KeyboardEvent, ReactNode, useEffect, useState } from 'react'

import { AppCommandTheme } from '@/app/components/app-command-theme'
import { GithubIcon } from '@/app/components/github-icon'
import { Level } from '@/app/components/layout/level'
import Logo from '@/app/components/logo'
import { Button } from '@/app/components/ui/button'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandIconItem,
  CommandInput,
  CommandList,
} from '@/app/components/ui/command'
import { Dialog, DialogOverlay, DialogPortal } from '@/app/components/ui/dialog'
import { UserAvatar } from '@/app/components/user/user-avatar'
import { UserAvatarImage } from '@/app/components/user/user-avatar-image'
import { useUser } from '@/app/lib/model/use-user'
import {
  SIGN_IN,
  SIGN_UP,
  toBar,
  toFollowing,
  toHome,
  toSpecs,
} from '@/app/lib/routes'

export function AppCommand() {
  const router = useRouter()
  const pathname = usePathname()
  const { signOut } = useClerk()
  const { user, isLoaded } = useUser()
  const username = user?.username

  const [open, setOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [value, setValue] = useState(() => toHome(username))

  useEffect(() => {
    function handleKeydown(e: globalThis.KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') setOpen(true)
    }
    document.addEventListener('keydown', handleKeydown)
    return () => document.removeEventListener('keydown', handleKeydown)
  }, [setOpen])

  if (!isLoaded) return null

  if (!user || !username) {
    return (
      <Sticky>
        <Level className="sm:gap-4 [&>*]:pt-[0.22rem]" gap={3}>
          <Link href={SIGN_IN}>
            <Button variant="outline" size="sm">
              Sign In
            </Button>
          </Link>
          {pathname !== '/' && (!user || !username) && (
            <Link href={SIGN_UP}>
              <Button size="sm">Sign Up</Button>
            </Link>
          )}
        </Level>
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
          className="h-9 w-9 overflow-hidden rounded-full shadow-md sm:h-11 sm:w-11"
          onClick={() => setOpen(true)}
        >
          <UserAvatarImage user={user} size="xl" />
        </button>
      </Sticky>

      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogPortal className="z-50">
          <DialogOverlay />
          <DialogContent className="animate-in data-[state=open]:fade-in-90 data-[state=open]:slide-in-from-bottom-10 sm:zoom-in-90 data-[state=open]:sm:slide-in-from-bottom-0 fixed z-50 grid h-[calc(100vh-200px)] gap-4 overflow-hidden rounded-2xl">
            <div className="h-full w-full overflow-auto [&_.cl-card]:mx-0">
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
        <CommandList className="h-[404px] max-h-screen overscroll-contain">
          <CommandEmpty>No items found.</CommandEmpty>

          <CommandGroup heading="Links">
            <CommandIconItem
              name="Specs"
              desc="Cocktail Recipes"
              value={toSpecs(username)}
              icon={<CardStackIcon />}
              onSelect={handleLink}
            />
            <CommandIconItem
              name="Bar"
              desc="Bottles & Ingredients"
              value={toBar(username)}
              icon={<CubeIcon />}
              onSelect={handleLink}
            />
            <CommandIconItem
              name="Following"
              desc="Other Bar Managers"
              value={toFollowing(username)}
              icon={<AvatarIcon />}
              onSelect={handleLink}
            />
          </CommandGroup>

          <AppCommandTheme onSelect={() => setOpen(false)} />

          <CommandGroup heading="User">
            <CommandIconItem
              name="Profile"
              icon={<UserAvatarImage user={user} size="sm" />}
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
              icon={<Logo className="-m-1 h-6 w-6" />}
              onSelect={(href) => {
                window?.open(href)
                setOpen(false)
              }}
            />
            <CommandIconItem
              name="Github"
              desc="Source Code"
              value="https://www.github.com/adamsome/lqr"
              icon={<GithubIcon className="h-4 w-4" />}
              onSelect={(href) => {
                window?.open(href)
                setOpen(false)
              }}
            />
          </CommandGroup>
        </CommandList>

        <div className="flex h-10 items-center justify-between border-t px-3">
          <div className="text-accent-muted flex items-center gap-2 font-semibold">
            <Logo
              className="-m-1.5 h-7 w-7"
              body="text-accent-muted"
              line="text-primary"
            />
            Lqr
          </div>
          <div className="flex items-center gap-2">
            <Button
              className="flex items-center gap-2"
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
    <div className="sticky top-0 z-40 w-full [&>*]:absolute [&>*]:right-2 [&>*]:top-2">
      {children}
    </div>
  )
}
