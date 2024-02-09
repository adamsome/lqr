import { auth } from '@clerk/nextjs'
import { NextRequest, NextResponse } from 'next/server'

import { getUser, setUserExcludedAllFolloweesAt } from '@/app/lib/model/user'

export async function PUT(
  req: NextRequest,
  { params = {} }: { params?: { username?: string } },
) {
  const { username } = params
  const user = await getUser(username)
  const { id: userID } = user ?? {}
  if (!userID) {
    return NextResponse.json(
      {
        error: `No user w/ username '${username}' found to exclude all followees.`,
      },
      { status: 400 },
    )
  }

  const { userId: currentUserID } = auth()
  if (!currentUserID) {
    return NextResponse.json(
      { error: `Must be signed in to exclude all followees.` },
      { status: 401 },
    )
  }

  if (currentUserID !== userID) {
    return NextResponse.json(
      { error: `Can only exclude all followees for yourself.` },
      { status: 403 },
    )
  }

  return NextResponse.json(await setUserExcludedAllFolloweesAt(userID))
}
