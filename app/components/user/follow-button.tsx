'use client'

import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'

import { Button } from '@/app/components/ui/button'
import { useMutate } from '@/app/api/use-mutate'
import { API_USERS } from '@/app/lib/routes'
import { Follow } from '@/app/lib/types'
import { cn } from '@/app/lib/utils'

type Props = {
  username: string
  follow?: Follow | null
}

export const FollowButton = forwardRef<
  ElementRef<typeof Button>,
  ComponentPropsWithoutRef<typeof Button> & Props
>(({ className, username, follow, ...props }, ref) => {
  const { followedAt, follows } = follow || {}
  const { mutating, mutate } = useMutate(`${API_USERS}/${username}/follow`, {
    watchData: follow ? followedAt : '__na',
  })
  return (
    <Button
      ref={ref}
      className={cn('w-24 text-base', className)}
      variant={follows ? 'outline' : 'default'}
      size="sm"
      disabled={mutating}
      onClick={() => {
        if (mutating) return
        mutate({ method: follows ? 'DELETE' : 'PUT' })
      }}
      {...props}
    >
      {follows ? 'Unfollow' : 'Follow'}
    </Button>
  )
})
FollowButton.displayName = 'FollowButton'
