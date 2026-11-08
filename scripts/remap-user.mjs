// Merge a new Better Auth user into an existing lqr user record, re-pointing
// all of the old user ID's data (specs, follows, exclusions) to the new ID.
//
// Usage (from scripts/):
//   node remap-user.mjs <oldUserID> <newUserID>          # dry run
//   node remap-user.mjs <oldUserID> <newUserID> --apply  # write
//
// The old `user` record keeps its username, stock, onboarding state and
// counts; it takes the new ID and avatar. The new user's own record is
// removed, and follows it made that duplicate the old user's are dropped.
// Before writing, every affected document is saved to remap-backup-*.json.

import { writeFileSync } from 'fs'
import { MongoClient, ObjectId } from 'mongodb'

import { loadEnvLocal } from './load-env-local.mjs'

loadEnvLocal()

const [oldID, newID, flag] = process.argv.slice(2)
const apply = flag === '--apply'
if (!oldID || !newID || (flag && !apply)) {
  console.error('Usage: node remap-user.mjs <oldUserID> <newUserID> [--apply]')
  process.exit(1)
}

const { MONGODB_URI, MONGODB_DB } = process.env
const client = new MongoClient(MONGODB_URI)
const db = client.db(MONGODB_DB)
const users = db.collection('user')
const follows = db.collection('follow')
const specs = db.collection('spec')
const authUsers = db.collection('auth_user')

function fail(message) {
  console.error(`Error: ${message}`)
  process.exit(1)
}

try {
  console.log(`${apply ? 'APPLY' : 'DRY RUN'} on db '${MONGODB_DB}'`)
  console.log(`  ${oldID} -> ${newID}\n`)

  const [oldUser, newUser, authUser] = await Promise.all([
    users.findOne({ id: oldID }),
    users.findOne({ id: newID }),
    authUsers.findOne({ _id: new ObjectId(newID) }),
  ])
  if (!oldUser) fail(`no user record with id '${oldID}'`)
  if (!authUser) fail(`no auth_user with id '${newID}'`)

  const usernameOwner = await authUsers.findOne({
    username: oldUser.username,
    _id: { $ne: authUser._id },
  })
  if (usernameOwner)
    fail(`username '${oldUser.username}' already belongs to another account`)

  const [oldFollows, newFollows, followedBy, oldSpecs, excluders] =
    await Promise.all([
      follows.find({ follower: oldID }).toArray(),
      follows.find({ follower: newID }).toArray(),
      follows.find({ followee: oldID }).toArray(),
      specs.find({ userID: oldID }).toArray(),
      users.find({ excludeFollowees: oldID }).toArray(),
    ])

  const oldFollowees = new Set(oldFollows.map((f) => f.followee))
  const dupFollows = newFollows.filter((f) => oldFollowees.has(f.followee))
  const keptNewFollows = newFollows.filter((f) => !oldFollowees.has(f.followee))
  const newIngredients = Object.keys(newUser?.ingredients ?? {})

  console.log(`user '${oldUser.username}' (${oldID})`)
  console.log(`  specs: ${oldSpecs.length}, follows: ${oldFollows.length}`)
  console.log(
    `  followed by: ${followedBy.length}, excluded by: ${excluders.length}`,
  )
  console.log(
    `new user '${authUser.username}' (${newID})${newUser ? '' : ' (no user record)'}`,
  )
  console.log(
    `  follows: ${newFollows.length} (${dupFollows.length} duplicate -> delete, ${keptNewFollows.length} keep)`,
  )
  console.log(`  stocked ingredients to merge: ${newIngredients.length}\n`)

  console.log('Plan:')
  console.log(`  - spec.userID: re-point ${oldSpecs.length}`)
  console.log(`  - follow.follower: re-point ${oldFollows.length}`)
  console.log(`  - follow.followee: re-point ${followedBy.length}`)
  console.log(`  - follow: delete ${dupFollows.length} duplicates`)
  console.log(`  - user.excludeFollowees: re-point in ${excluders.length}`)
  console.log(
    `  - user '${oldUser.username}': id -> ${newID}, imageUrl from new user, recount following`,
  )
  console.log(`  - user '${authUser.username}': delete record`)
  console.log(
    `  - auth_user ${newID}: username '${authUser.username}' -> '${oldUser.username}'`,
  )

  if (!apply) {
    console.log('\nDry run only. Re-run with --apply to write.')
    process.exit(0)
  }

  const backupPath = `remap-backup-${Date.now()}.json`
  writeFileSync(
    backupPath,
    JSON.stringify(
      {
        oldID,
        newID,
        oldUser,
        newUser,
        authUser: { _id: authUser._id, username: authUser.username },
        oldFollows,
        newFollows,
        followedBy,
        specs: oldSpecs.map(({ _id, userID }) => ({ _id, userID })),
        excluders: excluders.map(({ _id, excludeFollowees }) => ({
          _id,
          excludeFollowees,
        })),
      },
      null,
      2,
    ),
  )
  console.log(`\nBackup written to scripts/${backupPath}`)

  const session = client.startSession()
  try {
    await session.withTransaction(async () => {
      const opts = { session }
      await specs.updateMany(
        { userID: oldID },
        { $set: { userID: newID } },
        opts,
      )
      if (dupFollows.length)
        await follows.deleteMany(
          { _id: { $in: dupFollows.map((f) => f._id) } },
          opts,
        )
      await follows.updateMany(
        { follower: oldID },
        { $set: { follower: newID } },
        opts,
      )
      await follows.updateMany(
        { followee: oldID },
        { $set: { followee: newID } },
        opts,
      )
      await users.updateMany(
        { excludeFollowees: oldID },
        { $set: { 'excludeFollowees.$[e]': newID } },
        { ...opts, arrayFilters: [{ e: oldID }] },
      )
      if (newUser) await users.deleteOne({ _id: newUser._id }, opts)
      const followingCount = await follows.countDocuments(
        { follower: newID, follows: true },
        opts,
      )
      const $set = { id: newID, followingCount }
      if (newUser?.imageUrl) $set.imageUrl = newUser.imageUrl
      for (const iid of newIngredients)
        $set[`ingredients.${iid}`] = newUser.ingredients[iid]
      await users.updateOne({ _id: oldUser._id }, { $set }, opts)
      await authUsers.updateOne(
        { _id: authUser._id },
        { $set: { username: oldUser.username } },
        opts,
      )
    })
  } finally {
    await session.endSession()
  }

  const merged = await users.findOne({ id: newID })
  console.log(
    `Done. '${merged.username}' (${merged.id}): specCount ${merged.specCount}, followingCount ${merged.followingCount}`,
  )
  console.log('Sign out and back in so the session picks up the new username.')
} finally {
  await client.close()
}
