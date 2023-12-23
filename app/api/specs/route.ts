import { currentUser } from '@clerk/nextjs'
import { NextRequest, NextResponse } from 'next/server'

import { addSpec, getSpec } from '@/lib/model/spec'
import { updateUserActedAt } from '@/lib/model/user'
import { Spec } from '@/lib/types'
import { slugify } from '@/lib/utils'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const spec: Spec = body.spec

  const user = await currentUser()
  if (!user) {
    return NextResponse.json(
      { data: `Must be signed in to add a spec.` },
      { status: 401 },
    )
  }

  if (!spec.id) spec.id = slugify(spec.name)
  if (!spec.userID) spec.userID = user.id
  if (!spec.username && user.username) spec.username = user.username

  const existing = await getSpec({ id: spec.id, userID: spec.userID })
  if (existing) {
    return NextResponse.json(
      { data: `Spec already exists with name ${spec.name}.` },
      { status: 422 },
    )
  }

  await Promise.all([addSpec(spec), updateUserActedAt(spec.userID)])

  return NextResponse.json(spec)
}
