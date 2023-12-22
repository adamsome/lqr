import { auth } from '@clerk/nextjs'
import { NextRequest, NextResponse } from 'next/server'

import { upsertFollow } from '@/lib/model/follow'
import { getUser } from '@/lib/model/user'

export async function PUT(
  _req: NextRequest,
  { params = {} }: { params?: { username?: string } },
) {
  const { username } = params
  const followeeUser = await getUser(username)
  const { id: followee } = followeeUser ?? {}
  if (!followee) {
    return NextResponse.json(
      { data: `No user w/ username '${username}' found to follow.` },
      { status: 400 },
    )
  }

  const { userId: follower } = auth()
  if (!follower) {
    return NextResponse.json(
      { data: `Must be signed in to follow a user.` },
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
  { params = {} }: { params?: { username?: string } },
) {
  const { username } = params
  const followeeUser = await getUser(username)
  const { id: followee } = followeeUser ?? {}
  if (!followee) {
    return NextResponse.json(
      { data: `No user w/ username '${username}' found to follow.` },
      { status: 400 },
    )
  }

  const { userId: follower } = auth()
  if (!follower) {
    return NextResponse.json(
      { data: `Must be signed in to unfollow a user.` },
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
