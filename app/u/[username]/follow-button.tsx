'use client'

import { Button } from '@/components/ui/button'
import { useMutate } from '@/lib/api/use-mutate'
import { API_USERS } from '@/lib/routes'
import { Follow } from '@/lib/types'

type Props = {
  username: string
  follow?: Follow | null
}

export function FollowButton({ username, follow }: Props) {
  const { followedAt, follows } = follow || {}
  const { mutating, mutate } = useMutate(`${API_USERS}/${username}/follow`, {
    watchData: follow ? followedAt : '__na',
  })
  return (
    <Button
      className="w-20"
      variant={follows ? 'outline' : 'default'}
      size="sm"
      disabled={mutating}
      onClick={() => {
        if (mutating) return
        mutate({ method: follows ? 'DELETE' : 'PUT' })
      }}
    >
      {follows ? 'Unfollow' : 'Follow'}
    </Button>
  )
}
