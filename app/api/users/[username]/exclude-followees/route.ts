import { getSessionUserID } from '@/app/lib/session'
import { NextRequest, NextResponse } from 'next/server'

import { getUser, setUserExcludedAllFolloweesAt } from '@/app/lib/model/user'

export async function PUT(
  req: NextRequest,
  props: { params?: Promise<{ username?: string }> },
) {
  const params = (await props.params) ?? {}
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

  const currentUserID = await getSessionUserID()
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
