import { cache } from 'react'

const ADMIN_BY_USER_ID: Record<string, boolean> = {
  user_2QaSdLhpL7dMcmD999SKB2teEIM: true,
}

export const isAdmin = cache((userID?: string | null) => {
  return ADMIN_BY_USER_ID[userID ?? '__na'] ?? false
})
