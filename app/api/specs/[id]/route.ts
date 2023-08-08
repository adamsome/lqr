import { auth } from '@clerk/nextjs'
import { NextRequest, NextResponse } from 'next/server'

import { deleteSpec, getSpec, updateSpec } from '@/lib/model/spec'
import { Spec } from '@/lib/types'

export async function PUT(req: NextRequest) {
  const body = await req.json()
  const spec: Spec = body.spec
  if (!spec?.id) {
    return NextResponse.json(
      { data: `Spec ID required to update.` },
      { status: 400 },
    )
  }

  const { userId: id } = auth()
  if (!id) {
    return NextResponse.json(
      { data: `Must be signed in to update a spec.` },
      { status: 401 },
    )
  }

  return NextResponse.json(await updateSpec(spec))
}

export async function DELETE(req: NextRequest) {
  const body = await req.json()
  const id: string = body.id
  if (!id) {
    return NextResponse.json(
      { data: `Spec ID required to delete.` },
      { status: 400 },
    )
  }

  const { userId: userID } = auth()
  if (!userID) {
    return NextResponse.json(
      { data: `Must be signed in to delete a spec.` },
      { status: 401 },
    )
  }

  const spec = await getSpec({ id })

  if (!spec) {
    return NextResponse.json(
      { data: `No spec with ID '${id}' to delete.` },
      { status: 400 },
    )
  }
  if (spec.userID !== userID) {
    return NextResponse.json(
      { data: `Cannot delete spec that you did not create.` },
      { status: 403 },
    )
  }

  return NextResponse.json(await deleteSpec({ id, userID }))
}
