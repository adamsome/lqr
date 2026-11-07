import { Stack } from '@/app/components/layout/stack'
import { getUserSpecs } from '@/app/lib/model/user-specs'
import { OnboardingDoneButton } from '@/app/u/[username]/bar/onboarding-done-button'

type Props = {
  userID: string
  username: string
}

// Shown on the user's own bar until they finish onboarding
export async function Onboarding({ userID, username }: Props) {
  const { specs } = await getUserSpecs(userID, {
    ingredientsStockUserID: userID,
  })
  const makeable = specs.filter(
    ({ stock }) => stock && stock.total > 0 && stock.count === stock.total,
  ).length

  return (
    <Stack
      className="rounded-lg border border-accent-muted/20 bg-accent/40 p-4"
      gap={3}
    >
      <Stack gap={1}>
        <h2 className="font-semibold">Welcome! What&apos;s in your bar?</h2>
        <p className="text-sm text-muted-foreground">
          Tap the bottles and ingredients you have under{' '}
          <span className="font-medium text-foreground">Bar Essentials</span>{' '}
          below, and we&apos;ll work out which of the {specs.length} specs from
          you and the people you follow you can make.
        </p>
      </Stack>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm" aria-live="polite">
          You can make{' '}
          <span className="font-semibold text-accent-strong">{makeable}</span>{' '}
          {makeable === 1 ? 'spec' : 'specs'} so far
        </p>
        <OnboardingDoneButton username={username} />
      </div>
    </Stack>
  )
}
