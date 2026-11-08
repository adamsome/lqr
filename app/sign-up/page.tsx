import { redirect } from 'next/navigation'

import { SIGN_IN } from '@/app/lib/routes'

// Signing in creates an account, so sign-up is the same flow
export default function Page() {
  redirect(SIGN_IN)
}
