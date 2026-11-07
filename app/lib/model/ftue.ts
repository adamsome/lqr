import { getFollow, upsertFollow } from '@/app/lib/model/follow'
import { ensureUserEntity, updateUserFtue } from '@/app/lib/model/user'
import type { User } from '@/app/lib/types'

import 'server-only'

// First-time user experience: unset (new) -> 'bar' (onboarding) -> 'spec' (done)
export type FtueStep = 'bar' | 'spec'

// Followed on first sign-in so new users have specs to browse
export const DEFAULT_FOLLOWEE_IDS = ['user_classics', 'user_modern_classics']

export const isOnboarding = (ftue?: string) => ftue !== 'spec'

// Idempotent: safe to call on every visit while onboarding
export async function startFtue(user: User) {
  await ensureUserEntity(user)
  // Sequential so each follow's count recount sees the previous write
  for (const followee of DEFAULT_FOLLOWEE_IDS) {
    // Don't override an explicit follow or unfollow
    if (await getFollow(followee, user.id)) continue
    await upsertFollow({
      followee,
      follower: user.id,
      followedAt: new Date().toISOString(),
      follows: true,
    })
  }
  await updateUserFtue(user.id, 'bar' satisfies FtueStep)
}

export async function completeFtue(userID: string) {
  await updateUserFtue(userID, 'spec' satisfies FtueStep)
}
