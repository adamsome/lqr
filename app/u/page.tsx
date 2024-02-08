import { redirect } from 'next/navigation'

import { getCurrentUser } from '@/app/lib/model/user'
import { toBar, toHome } from '@/app/lib/routes'

export default async function Page() {
  const { currentUser } = await getCurrentUser()
  if (!currentUser) {
    redirect('/')
  }
  const { username, ftue } = currentUser
  return !ftue || ftue === 'bar'
    ? redirect(toBar(username))
    : redirect(toHome(username))
}
