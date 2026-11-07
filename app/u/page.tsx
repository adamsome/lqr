import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

import { getCurrentUser } from '@/app/lib/model/user'
import { toBar, toHome } from '@/app/lib/routes'

export default async function Page() {
  await auth.protect()
  const { currentUser } = await getCurrentUser()
  if (!currentUser) {
    redirect('/')
  }
  const { username, ftue } = currentUser
  return !ftue || ftue === 'bar'
    ? redirect(toBar(username))
    : redirect(toHome(username))
}
