import { cache } from 'react'

const ADMIN_BY_USER_ID: Record<string, boolean> = {
  '6af08db3151f21e2576317a3': true,
}

export const isAdmin = cache((userID?: string | null) => {
  return ADMIN_BY_USER_ID[userID ?? '__na'] ?? false
})
