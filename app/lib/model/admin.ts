import { auth } from '@clerk/nextjs'

const ADMIN_BY_USER_ID: Record<string, boolean> = {
  user_2QaSdLhpL7dMcmD999SKB2teEIM: true,
}

export function isAdmin(userID?: string | null) {
  return ADMIN_BY_USER_ID[userID ?? '__na'] ?? false
}
