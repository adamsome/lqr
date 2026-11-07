'use server'

import { auth } from '@clerk/nextjs/server'

import { completeFtue } from '@/app/lib/model/ftue'

export async function completeBarOnboarding() {
  const { userId } = await auth()
  if (!userId) return { ok: false as const, error: 'Must be signed in.' }
  await completeFtue(userId)
  return { ok: true as const }
}
