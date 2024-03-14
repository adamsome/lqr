import Link from 'next/link'

import {
  AppContent,
  AppHeader,
  AppLayout,
} from '@/app/components/layout/app-layout'
import { Level } from '@/app/components/layout/level'
import { Stack } from '@/app/components/layout/stack'
import { Button } from '@/app/components/ui/button'
import { UserAvatar } from '@/app/components/user/user-avatar'
import { getCurrentUser } from '@/app/lib/model/user'
import { SIGN_UP, toHome } from '@/app/lib/routes'
import { SampleBar } from '@/app/sample-bar'
import { SampleSpecs } from '@/app/sample-specs'
import { ArrowRightIcon } from '@radix-ui/react-icons'
import { SAMPLE_SPECS_PATH } from './lib/ingredient/samples'

export const revalidate = 0

export default async function Page() {
  const { currentUser } = await getCurrentUser()
  return (
    <AppLayout>
      <AppHeader title={<UserAvatar user={currentUser} />} />
      <AppContent className="relative pb-8 lg:gap-12">
        <h1 className="text-[2.5rem] font-bold leading-[2.5rem] lg:text-[5rem] lg:leading-[4.75rem]">
          Manage your
          <br />
          home bar
        </h1>
        <Level className="lg:justify-start" justify="center">
          <Level className="w-full max-w-md lg:gap-8">
            <Link className="flex-1" href={SAMPLE_SPECS_PATH}>
              <Button
                className="group w-full gap-1.5 px-2 text-lg"
                variant="secondary"
                size="lg"
              >
                <span className="whitespace-nowrap">Try it out</span>
                <ArrowRight />
              </Button>
            </Link>
            <Link
              className="flex-1"
              href={currentUser ? toHome(currentUser.username) : SIGN_UP}
            >
              <Button className="group w-full gap-1.5 px-2 text-lg" size="lg">
                {currentUser ? (
                  <>
                    <span className="whitespace-nowrap">My specs</span>
                    <ArrowRight />
                  </>
                ) : (
                  'Sign Up'
                )}
              </Button>
            </Link>
          </Level>
        </Level>
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:gap-y-8 lg:grid-cols-[2fr_3fr]">
          <Stack className="lg:gap-6" gap={3}>
            <h2 className="text-muted-foreground/90 pe-4 text-2xl font-semibold leading-[1.1]">
              <span className="text-foreground">Track your inventory</span>{' '}
              selecting which spirits, liquor categories, or ingredients are in
              stock.
            </h2>
            <SampleBar />
          </Stack>
          <Stack className="lg:gap-6" gap={3}>
            <h2 className="text-muted-foreground/90 max-w-[26rem] pe-4 text-2xl font-semibold leading-[1.1]">
              <span className="text-foreground">Explore your cocktails</span>{' '}
              and see what you can make with your stocked bottles & ingredients.
            </h2>
            <SampleSpecs />
          </Stack>
        </div>
        <Level className="my-2 lg:justify-end" justify="center">
          <Level className="w-full max-w-xs">
            <Link className="flex-1" href={SAMPLE_SPECS_PATH}>
              <Button
                className="group w-full gap-1.5 px-2 text-lg"
                variant="secondary"
                size="lg"
              >
                <span className="whitespace-nowrap">Try it out</span>
                <ArrowRight />
              </Button>
            </Link>
          </Level>
        </Level>
      </AppContent>
    </AppLayout>
  )
}

function ArrowRight() {
  return (
    <ArrowRightIcon
      className="transition-transform group-hover:translate-x-1"
      width={20}
      height={20}
    />
  )
}
