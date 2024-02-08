import { auth } from '@clerk/nextjs'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { addUserExcludeFollowee, getUser } from '@/app/lib/model/user'

const Schema = z.object({ followee: z.string() })

export async function PATCH(
  req: NextRequest,
  { params = {} }: { params?: { username?: string } },
) {
  const { username } = params
  const user = await getUser(username)
  const { id: userID } = user ?? {}
  if (!userID) {
    return NextResponse.json(
      { error: `No user w/ username '${username}' found to exclude followee.` },
      { status: 400 },
    )
  }

  const { userId: currentUserID } = auth()
  if (!currentUserID) {
    return NextResponse.json(
      { error: `Must be signed in to follow a user.` },
      { status: 401 },
    )
  }

  if (currentUserID !== userID) {
    return NextResponse.json(
      { error: `Can exclude followees for yourself.` },
      { status: 403 },
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

  const { followee } = body.data

  return NextResponse.json(await addUserExcludeFollowee(userID, followee))
}
