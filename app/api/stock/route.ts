import { connectToDatabase } from '@/lib/mongodb'
import { auth } from '@clerk/nextjs'
import { OptionalUnlessRequiredId } from 'mongodb'
import { NextRequest, NextResponse } from 'next/server'
import invariant from 'tiny-invariant'

import { User } from '@/lib/types'

export async function PUT(req: NextRequest) {
  const { userId: id } = auth()
  invariant(id, `User ID requried to get user data`)

  const { ingredientID, stock } = await req.json()
  const { db } = await connectToDatabase()
  await db
    .collection<OptionalUnlessRequiredId<User>>('user')
    .updateOne(
      { id },
      { $set: { [`ingredients.${ingredientID}.stock`]: stock } }
    )

  return NextResponse.json(true)
}
