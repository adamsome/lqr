import { currentUser } from '@clerk/nextjs'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { isAdmin } from '@/app/lib/model/admin'
import { addSpec, getSpec } from '@/app/lib/model/spec'
import { toUser } from '@/app/lib/model/to-user'
import { getUser, updateUserActedAt } from '@/app/lib/model/user'
import { SpecSchema } from '@/app/lib/schema/spec'
import { Spec, User } from '@/app/lib/types'
import { slugify } from '@/app/lib/utils'

const SpecWithoutID = SpecSchema.partial({ id: true, userID: true })

const Schema = z.object({
  spec: SpecWithoutID,
})

export async function POST(req: NextRequest) {
  const currentAuthUser = await currentUser()
  if (!currentAuthUser) {
    return NextResponse.json(
      { error: `Must be signed in to add a spec.` },
      { status: 401 },
    )
  }

  const body = Schema.safeParse(await req.json())
  if (!body.success) {
    const { errors } = body.error
    return NextResponse.json(
      { error: `Invalid request`, errors },
      { status: 500 },
    )
  }

  let user = toUser(currentAuthUser)

  const { username, name: specName } = body.data.spec

  if (username !== user.username) {
    if (!isAdmin(user.id)) {
      return NextResponse.json(
        {
          error: `Cannot create spec '${specName}' for user '${user.username}'.`,
        },
        { status: 401 },
      )
    }
    const specUser = await getUser(username)
    if (!specUser) {
      return NextResponse.json(
        { error: `Cannot find user with username '${username}'.` },
        { status: 400 },
      )
    }
    user = specUser
  }

  const spec = toSpec(body.data.spec, user)

  const existing = await getSpec(spec.id, spec.userID)
  if (existing) {
    return NextResponse.json(
      { error: `Spec already exists with name ${spec.name}.` },
      { status: 422 },
    )
  }

  await Promise.all([addSpec(spec), updateUserActedAt(spec.userID)])

  return NextResponse.json(spec)
}

function toSpec(spec: z.infer<typeof SpecWithoutID>, user: User): Spec {
  return {
    ...spec,
    id: spec.id ?? slugify(spec.name),
    userID: spec.userID ?? user.id,
  }
}
