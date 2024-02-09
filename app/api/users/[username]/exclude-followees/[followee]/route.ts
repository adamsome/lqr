import { auth } from '@clerk/nextjs'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import {
  addUserExcludeFollowee,
  getUser,
  getUserByID,
} from '@/app/lib/model/user'

export async function PATCH(
  req: NextRequest,
  { params = {} }: { params?: { username?: string; followee?: string } },
) {
  const { username, followee } = params
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
      { error: `Must be signed in to exclude a followee.` },
      { status: 401 },
    )
  }

  if (currentUserID !== userID) {
    return NextResponse.json(
      { error: `Can only exclude followees for yourself.` },
      { status: 403 },
    )
  }

  const followeeUser = await getUserByID(followee)
  if (!followeeUser) {
    return NextResponse.json(
      { error: `Followee (ID: '${username}') not found to exclude.` },
      { status: 400 },
    )
  }

  return NextResponse.json(
    await addUserExcludeFollowee(userID, followeeUser.id),
  )
}
