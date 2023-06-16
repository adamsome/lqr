import { auth } from '@clerk/nextjs'
import { NextRequest, NextResponse } from 'next/server'
import invariant from 'tiny-invariant'

import { updateSpec } from '@/lib/model/spec'
import { Spec } from '@/lib/types'

export async function PUT(req: NextRequest) {
  const body = await req.json()
  const spec: Spec = body.spec
  invariant(spec?.id, `Spec with id required to update`)

  const { userId: id } = auth()
  invariant(id, `User ID requried to update a spec`)

  await updateSpec(spec)

  return NextResponse.json(true)
}
