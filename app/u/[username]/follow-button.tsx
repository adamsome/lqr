'use client'

import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'

import { Button } from '@/components/ui/button'
import { useMutate } from '@/lib/api/use-mutate'
import { API_USERS } from '@/lib/routes'
import { Follow } from '@/lib/types'
import { cn } from '@/lib/utils'

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
      className={cn('w-20', className)}
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
