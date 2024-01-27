import { SignIn } from '@clerk/nextjs'

export default function Page() {
  const url = '/u'
  return (
    <main className="flex h-[calc(100vh-theme(spacing.14))] flex-col items-center justify-center">
      <SignIn afterSignUpUrl={url} afterSignInUrl={url} />
    </main>
  )
}
