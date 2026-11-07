import { NextResponse, type NextRequest } from 'next/server'

import { getUser } from '@/app/lib/model/user'

// Public profile only (id, username, imageUrl); never the raw Clerk user,
// which includes email addresses.
export async function GET(
  _req: NextRequest,
  props: { params: Promise<{ username: string }> },
) {
  const { username } = await props.params
  const user = await getUser(username)
  return NextResponse.json({ user })
}
