import { clerkClient } from '@clerk/nextjs/server'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(
  _req: NextRequest,
  props: { params: Promise<{ username: string }> },
) {
  const params = await props.params
  const { username } = params
  const {
    data: [user],
  } = await (await clerkClient()).users.getUserList({ username: [username] })
  return NextResponse.json({ user })
}
