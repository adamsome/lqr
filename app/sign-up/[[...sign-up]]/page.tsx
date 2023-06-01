import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <main className="flex h-[calc(100vh-theme(spacing.14))] flex-col items-center justify-center">
      <SignUp />
    </main>
  )
}
