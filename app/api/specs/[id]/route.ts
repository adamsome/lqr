import { auth } from '@clerk/nextjs'
import { NextRequest, NextResponse } from 'next/server'

import { deleteSpec, getSpec, updateSpec } from '@/app/lib/model/spec'
import { updateUserActedAt } from '@/app/lib/model/user'
import { Spec } from '@/app/lib/types'

export async function PUT(req: NextRequest) {
  const body = await req.json()
  const spec: Spec = body.spec
  if (!spec?.id) {
    return NextResponse.json(
      { error: `Spec ID required to update.` },
      { status: 400 },
    )
  }

  const { userId: id } = auth()
  if (!id) {
    return NextResponse.json(
      { error: `Must be signed in to update a spec.` },
      { status: 401 },
    )
  }

  const [res] = await Promise.all([
    updateSpec(spec),
    updateUserActedAt(spec.userID),
  ])

  return NextResponse.json(res)
}

export async function DELETE(req: NextRequest) {
  const body = await req.json()
  const id: string = body.id
  if (!id) {
    return NextResponse.json(
      { error: `Spec ID required to delete.` },
      { status: 400 },
    )
  }

  const { userId: userID } = auth()
  if (!userID) {
    return NextResponse.json(
      { error: `Must be signed in to delete a spec.` },
      { status: 401 },
    )
  }

  const spec = await getSpec(id, userID)

  if (!spec) {
    return NextResponse.json(
      { error: `No spec with ID '${id}' to delete.` },
      { status: 400 },
    )
  }
  if (spec.userID !== userID) {
    return NextResponse.json(
      { error: `Cannot delete spec that you did not create.` },
      { status: 403 },
    )
  }

  const [res] = await Promise.all([
    deleteSpec({ id, userID }),
    updateUserActedAt(spec.userID),
  ])

  return NextResponse.json(res)
}
