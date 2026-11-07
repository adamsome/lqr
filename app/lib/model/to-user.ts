import type { User as AuthUser } from '@clerk/nextjs/server'
import type { UserResource } from '@clerk/nextjs/types'

import { User } from '@/app/lib/types'

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
