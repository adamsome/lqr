import { getSessionUserID } from '@/app/lib/session'
import { NextRequest, NextResponse } from 'next/server'

import { upsertFollow } from '@/app/lib/model/follow'
import { getUser } from '@/app/lib/model/user'

export async function PUT(
  _req: NextRequest,
  props: { params?: Promise<{ username?: string }> },
) {
  const params = (await props.params) ?? {}
  const { username } = params
  const followeeUser = await getUser(username)
  const { id: followee } = followeeUser ?? {}
  if (!followee) {
    return NextResponse.json(
      { error: `No user w/ username '${username}' found to follow.` },
      { status: 400 },
    )
  }

  const follower = await getSessionUserID()
  if (!follower) {
    return NextResponse.json(
      { error: `Must be signed in to follow a user.` },
      { status: 401 },
    )
  }

  return NextResponse.json(
    await upsertFollow({
      followee,
      follower,
      followedAt: new Date().toISOString(),
      follows: true,
    }),
  )
}

export async function DELETE(
  _req: NextRequest,
  props: { params?: Promise<{ username?: string }> },
) {
  const params = (await props.params) ?? {}
  const { username } = params
  const followeeUser = await getUser(username)
  const { id: followee } = followeeUser ?? {}
  if (!followee) {
    return NextResponse.json(
      { error: `No user w/ username '${username}' found to follow.` },
      { status: 400 },
    )
  }

  const follower = await getSessionUserID()
  if (!follower) {
    return NextResponse.json(
      { error: `Must be signed in to unfollow a user.` },
      { status: 401 },
    )
  }

  return NextResponse.json(
    await upsertFollow({
      followee,
      follower,
      followedAt: new Date().toISOString(),
      follows: false,
    }),
  )
}
