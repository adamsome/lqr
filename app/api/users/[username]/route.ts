import { clerkClient } from '@clerk/nextjs'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(
  _req: NextRequest,
  { params }: { params: { username: string } },
) {
  const { username } = params
  const [user] = await clerkClient.users.getUserList({ username: [username] })
  return NextResponse.json({ user })
}
