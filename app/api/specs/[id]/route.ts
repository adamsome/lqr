import { auth } from '@clerk/nextjs'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { deleteSpec, getSpec, updateSpec } from '@/app/lib/model/spec'
import { updateUserActedAt } from '@/app/lib/model/user'
import { SpecSchema } from '@/app/lib/schema/spec'
import { isAdmin } from '@/app/lib/model/admin'

const PutSchema = z.object({
  spec: SpecSchema,
})

export async function PUT(req: NextRequest) {
  const { userId: id } = auth()
  if (!id) {
    return NextResponse.json(
      { error: `Must be signed in to update a spec.` },
      { status: 401 },
    )
  }

  const body = PutSchema.safeParse(await req.json())
  if (!body.success) {
    const { errors } = body.error
    return NextResponse.json(
      { error: `Invalid request`, errors },
      { status: 500 },
    )
  }

  const { spec } = body.data
  const { userID } = spec

  if (userID !== id && !isAdmin(id)) {
    return NextResponse.json(
      {
        error: `Cannot edit spec '${spec.name}' for another user '${spec.username}'`,
      },
      { status: 401 },
    )
  }

  const [res] = await Promise.all([
    updateSpec(spec),
    updateUserActedAt(spec.userID),
  ])

  return NextResponse.json(res)
}

const DeleteSchema = z.object({
  id: z.string(),
})

export async function DELETE(req: NextRequest) {
  const { userId: userID } = auth()
  if (!userID) {
    return NextResponse.json(
      { error: `Must be signed in to delete a spec.` },
      { status: 401 },
    )
  }

  const body = DeleteSchema.safeParse(await req.json())
  if (!body.success) {
    const { errors } = body.error
    return NextResponse.json(
      { error: `Invalid request`, errors },
      { status: 500 },
    )
  }

  const { id } = body.data

  if (!id) {
    return NextResponse.json(
      { error: `Spec ID required to delete.` },
      { status: 400 },
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
