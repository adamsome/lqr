import { auth, clerkClient } from '@clerk/nextjs'
import { OptionalUnlessRequiredId } from 'mongodb'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { connectToDatabase } from '@/app/lib/mongodb'
import { User } from '@/app/lib/types'
import { addUser } from '@/app/lib/model/user'
import { toUser } from '@/app/lib/model/to-user'

const Schema = z.object({
  ingredientIDs: z.string().array(),
  stock: z.number(),
})

export async function PUT(req: NextRequest) {
  const { userId: userID } = auth()
  if (!userID) {
    return NextResponse.json(
      { error: `Must be signed in to get user data.` },
      { status: 401 },
    )
  }

  const body = Schema.safeParse(await req.json())
  if (!body.success) {
    const { errors } = body.error
    return NextResponse.json(
      { error: `Invalid request`, errors },
      { status: 500 },
    )
  }

  const { ingredientIDs, stock } = body.data

  const $set = ingredientIDs.reduce(
    (acc, iid) => {
      acc[`ingredients.${iid}.stock`] = stock
      return acc
    },
    {} as Record<string, number>,
  )

  const { db } = await connectToDatabase()

  const update = () =>
    db
      .collection<OptionalUnlessRequiredId<User>>('user')
      .updateOne({ id: userID }, { $set })

  let res = await update()

  if (!res.matchedCount) {
    const user = await clerkClient.users.getUser(userID).then(toUser)
    await addUser({ id: user.id, username: user.username })
    res = await update()

    if (!res.matchedCount) {
      const ids = ingredientIDs.map((iid) => `'${iid}`).join(', ')
      const error = `User '${userID}' not found while attempting to stock ${ids}`
      return NextResponse.json({ error }, { status: 400 })
    }
  }

  return NextResponse.json(res)
}
