import { requireSessionUserID } from '@/app/lib/session'
import { redirect } from 'next/navigation'

import { isOnboarding, startFtue } from '@/app/lib/model/ftue'
import { getCurrentUser } from '@/app/lib/model/user'
import { toBar, toHome } from '@/app/lib/routes'

// Landing route after sign-in/sign-up
export default async function Page() {
  await requireSessionUserID()
  const { currentUser } = await getCurrentUser()
  if (!currentUser) {
    redirect('/')
  }
  const { username, ftue } = currentUser
  if (!ftue) await startFtue(currentUser)
  return isOnboarding(ftue)
    ? redirect(toBar(username))
    : redirect(toHome(username))
}
