'use server'

import { getSessionUserID } from '@/app/lib/session'

import { completeFtue } from '@/app/lib/model/ftue'

export async function completeBarOnboarding() {
  const userId = await getSessionUserID()
  if (!userId) return { ok: false as const, error: 'Must be signed in.' }
  await completeFtue(userId)
  return { ok: true as const }
}
