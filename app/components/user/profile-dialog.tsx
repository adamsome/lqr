'use client'

import { ExitIcon } from '@radix-ui/react-icons'

import { Button } from '@/app/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog'
import { UserAvatarImage } from '@/app/components/user/user-avatar-image'
import { authClient } from '@/app/lib/auth-client'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSignOut: () => void
}

export function ProfileDialog({ open, onOpenChange, onSignOut }: Props) {
  const { data } = authClient.useSession()
  const user = data?.user

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Profile</DialogTitle>
          <DialogDescription>Your lqr account</DialogDescription>
        </DialogHeader>
        {user && (
          <div className="flex items-center gap-4">
            <UserAvatarImage
              user={{
                username: user.username ?? '',
                imageUrl: user.image ?? undefined,
              }}
              size="2xl"
            />
            <div className="flex min-w-0 flex-col">
              <span className="font-semibold">{user.username}</span>
              <span className="truncate text-sm text-muted-foreground">
                {user.email}
              </span>
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onSignOut}>
            <ExitIcon className="mr-2" />
            Sign Out
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
