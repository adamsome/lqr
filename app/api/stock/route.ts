import { auth } from '@clerk/nextjs'
import { OptionalUnlessRequiredId } from 'mongodb'
import { NextRequest, NextResponse } from 'next/server'

import { connectToDatabase } from '@/lib/mongodb'
import { User } from '@/lib/types'

export async function PUT(req: NextRequest) {
  const { userId: id } = auth()
  if (!id) {
    return NextResponse.json(
      { data: `Must be signed in to get user data.` },
      { status: 401 },
    )
  }

  const { ingredientID, stock } = await req.json()
  const { db } = await connectToDatabase()
  await db
    .collection<OptionalUnlessRequiredId<User>>('user')
    .updateOne(
      { id },
      { $set: { [`ingredients.${ingredientID}.stock`]: stock } },
    )

  return NextResponse.json(true)
}
