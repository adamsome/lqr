import { redirect } from 'next/navigation'

import { getSessionUserID } from '@/app/lib/session'
import { PageProps } from '@/app/lib/types'
import { SignInForm } from '@/app/sign-in/sign-in-form'

export default async function Page(props: PageProps) {
  if (await getSessionUserID()) redirect('/u')
  const { error } = (await props.searchParams) ?? {}
  return (
    <main className="flex h-[calc(100vh-theme(spacing.14))] flex-col items-center justify-center px-4">
      <SignInForm error={typeof error === 'string' ? error : undefined} />
    </main>
  )
}
