import Link from 'next/link'

import {
  AppContent,
  AppHeader,
  AppLayout,
} from '@/app/components/layout/app-layout'
import { Container } from '@/app/components/layout/container'
import { Level } from '@/app/components/layout/level'
import { Stack } from '@/app/components/layout/stack'
import { Button } from '@/app/components/ui/button'
import { UserAvatar } from '@/app/components/user/user-avatar'
import { getCurrentUser } from '@/app/lib/model/user'
import { SIGN_IN, SIGN_UP } from '@/app/lib/routes'
import { SampleBar } from '@/app/sample-bar'
import { SampleSpecs } from '@/app/sample-specs'

export const revalidate = 0

export default async function Page() {
  const { currentUser } = await getCurrentUser()
  return (
    <AppLayout>
      <AppHeader title={<UserAvatar user={currentUser} />} />
      <AppContent className="relative pb-8">
        <h1 className="text-[2.5rem] leading-[2.5rem] font-bold">
          Manage your
          <br />
          home bar
        </h1>
        {!currentUser && (
          <Level>
            <Link className="flex-1" href={SIGN_IN}>
              <Button className="w-full text-lg" variant="outline" size="lg">
                Sign In
              </Button>
            </Link>
            <Link className="flex-1" href={SIGN_UP}>
              <Button className="w-full text-lg" size="lg">
                Sign Up
              </Button>
            </Link>
          </Level>
        )}
        <Stack gap={3}>
          <h2 className="text-2xl text-muted-foreground/90 font-semibold leading-[1.1]">
            <span className="text-foreground">Track your inventory</span>{' '}
            selecting which spirits, liquor categories, or ingredients are in
            stock.
          </h2>
          <SampleBar />
        </Stack>
        <Stack gap={3}>
          <h2 className="text-2xl text-muted-foreground/90 font-semibold leading-[1.1]">
            <span className="text-foreground">Explore your cocktails</span> and
            see which you can make with your stocked bottles.
          </h2>
          <SampleSpecs />
        </Stack>
      </AppContent>
    </AppLayout>
  )
}
