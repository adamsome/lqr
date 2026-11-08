import { requireSessionUserID } from '@/app/lib/session'
import Link from 'next/link'
import { Suspense } from 'react'
import invariant from 'tiny-invariant'

import { Stack } from '@/app/components/layout/stack'
import { Button } from '@/app/components/ui/button'
import { isAdmin } from '@/app/lib/model/admin'
import { getSpec } from '@/app/lib/model/spec'
import { getUser } from '@/app/lib/model/user'
import { toSpecItem } from '@/app/lib/routes'
import { PageProps } from '@/app/lib/types'
import { SpecContainer } from '@/app/u/[username]/specs/[id]/edit/spec-container'

export const revalidate = 0

type Props = PageProps<{
  username: string
  id: string
}>

export default async function Page(props: Props) {
  const params = (await props.params) ?? {}
  const { username, id } = params

  const currentUserID = await requireSessionUserID()

  const user = await getUser(username)
  const spec = await getSpec(id, user?.id)

  invariant(user, `User not found.`)
  invariant(spec, `No spec found with id '${id}'.`)

  if (!isAdmin(currentUserID) && currentUserID !== spec.userID) {
    return (
      <Stack
        className="absolute inset-0 h-full w-full text-muted-foreground"
        items="center"
        justify="center"
        gap={3}
      >
        <div className="font-semibold text-foreground">
          {"You can't edit this spec"}
        </div>
        <div className="text-sm">Only its creator can make changes.</div>
        <Button asChild variant="secondary" size="sm">
          <Link href={toSpecItem(spec)}>Back to {spec.name}</Link>
        </Button>
      </Stack>
    )
  }

  return (
    <Suspense>
      <SpecContainer spec={spec} />
    </Suspense>
  )
}
