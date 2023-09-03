import { SignIn } from '@clerk/nextjs'

type Props = {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function Page({ searchParams }: Props) {
  return (
    <main className="flex h-[calc(100vh-theme(spacing.14))] flex-col items-center justify-center">
      <SignIn />
    </main>
  )
}
