'use client'

import { useAuth } from '@clerk/nextjs'

import { Button } from '@/components/ui/button'
import { useMutate } from '@/lib/api/use-mutate'
import { API_USERS } from '@/lib/routes'
import { Follow } from '@/lib/types'

type Props = {
  username: string
  follow?: Follow | null
}

export function FollowButton({ username, follow }: Props) {
  const { followee, followedAt } = follow || {}
  const { userId: currentUserID } = useAuth()
  const { mutating, mutate } = useMutate(`${API_USERS}/${username}/follow`, {
    watchData: follow ? followedAt : '__na',
  })
  return (
    <Button
      variant={follow ? 'outline' : 'default'}
      size="sm"
      disabled={mutating}
      onClick={() => {
        if (mutating) return
        mutate({ method: follow ? 'DELETE' : 'PUT' })
      }}
    >
      {follow ? 'Unfollow' : 'Follow'}
    </Button>
  )
}
