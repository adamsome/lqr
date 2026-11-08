import { useMemo } from 'react'

import { authClient } from '@/app/lib/auth-client'
import type { User } from '@/app/lib/types'

// The signed-in user, from the Better Auth session
export function useUser() {
  const { data, isPending } = authClient.useSession()
  const authUser = data?.user

  const user = useMemo<User | null>(
    () =>
      authUser
        ? {
            id: authUser.id,
            username: authUser.username ?? '',
            imageUrl: authUser.image ?? undefined,
          }
        : null,
    [authUser],
  )

  return { user, isLoaded: !isPending, isSignedIn: user != null }
}
