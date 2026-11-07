'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

import { Button } from '@/app/components/ui/button'
import { toSpecs } from '@/app/lib/routes'
import { completeBarOnboarding } from '@/app/u/[username]/bar/onboarding-action'

type Props = {
  username: string
}

export function OnboardingDoneButton({ username }: Props) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  return (
    <Button
      size="sm"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          const res = await completeBarOnboarding()
          if (res.ok) router.push(toSpecs(username))
        })
      }
    >
      {pending ? 'Saving…' : 'Done, show my specs'}
    </Button>
  )
}
