import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { cache } from 'react'

import { auth } from '@/app/lib/auth'
import { SIGN_IN } from '@/app/lib/routes'

import 'server-only'

export const getSession = cache(async () =>
  auth.api.getSession({ headers: await headers() }),
)

// The signed-in user's ID, or null when signed out
export async function getSessionUserID(): Promise<string | null> {
  return (await getSession())?.user.id ?? null
}

// For pages that need sign-in: redirects signed-out visitors to sign in
export async function requireSessionUserID(): Promise<string> {
  const userID = await getSessionUserID()
  if (!userID) redirect(SIGN_IN)
  return userID
}
