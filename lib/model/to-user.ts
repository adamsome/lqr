import type { User as AuthUser } from '@clerk/nextjs/dist/types/server'
import type { UserResource } from '@clerk/types'

import { User } from '@/lib/types'

export const toUser = ({
  id,
  username,
  emailAddresses,
  imageUrl,
}: AuthUser | UserResource): User => ({
  id,
  username: username ?? emailAddresses[0]?.emailAddress ?? 'Unknown',
  imageUrl,
})
