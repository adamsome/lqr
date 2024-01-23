import { toUser } from '@/app/lib/model/to-user'
import { useUser as useRawUser } from '@clerk/nextjs'

export function useUser() {
  const { user, ...rest } = useRawUser()
  return { user: user ? toUser(user) : user, ...rest }
}
