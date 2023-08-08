import { useAuth, useUser as clerkUseUser } from '@clerk/nextjs'

export function useUser() {
  const { user } = clerkUseUser()
  const { id, username } = user ?? {}
  return { id, username, admin: username === 'adamsome' }
}
