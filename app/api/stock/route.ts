import { connectToDatabase } from '@/lib/mongodb'
import { User } from '@/lib/types'
import { OptionalUnlessRequiredId } from 'mongodb'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(req: NextRequest) {
  const { ingredientID, stock } = await req.json()
  console.log('put', ingredientID, stock)
  const { db } = await connectToDatabase()
  const user = await db
    .collection<OptionalUnlessRequiredId<User>>('user')
    .updateOne(
      { username: 'adamb' },
      { $set: { [`ingredients.${ingredientID}.stock`]: stock } }
    )

  return NextResponse.json(true)
}
