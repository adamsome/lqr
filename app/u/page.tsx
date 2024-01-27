import { redirect } from 'next/navigation'

import { getCurrentUser } from '@/app/lib/model/user'
import { toHome } from '@/app/lib/routes'

export default async function Page() {
  const { currentUser } = await getCurrentUser()
  return currentUser ? redirect(toHome(currentUser.username)) : redirect('/')
}
