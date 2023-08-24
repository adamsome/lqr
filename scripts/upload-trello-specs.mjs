import { compareAsc, parseISO } from 'date-fns'
import { readFileSync } from 'fs'
import { MongoClient } from 'mongodb'
import { resolve } from 'path'

import { loadEnvLocal } from './load-env-local.mjs'

loadEnvLocal()

const specsPath = resolve(process.cwd(), '../json/specs-trello.json')
const specsJson = readFileSync(specsPath, 'utf-8')
const specDict = JSON.parse(specsJson)
const specIDs = Object.keys(specDict)
let specs = specIDs.map((id) => specDict[id])

const { MONGODB_DB, MONGODB_URI } = process.env
const client = new MongoClient(MONGODB_URI)
await client.connect()
const lqrDB = client.db(MONGODB_DB)
const specColl = lqrDB.collection('spec')

const prevSpecs = await specColl
  .find({ username: 'classics' }, { projection: { _id: false } })
  .toArray()
const prevSpecDict = prevSpecs.reduce((acc, s) => ({ ...acc, [s.id]: s }), {})

specs = specs.map((curr) => {
  const prev = prevSpecDict[curr.id] ?? {}
  const ingredients = curr.ingredients.map((it, i) => ({
    ...(prev.ingredients?.[i] ?? {}),
    ...it,
  }))
  let createdAt = curr.createdAt
  if (prev.createdAt) {
    if (compareAsc(parseISO(prev.createdAt), parseISO(createdAt)) === -1) {
      createdAt = prev.createAt
    }
  }
  let updatedAt = prev.updatedAt ?? curr.updatedAt
  return {
    ...prev,
    ...curr,
    ingredients,
    createdAt,
    updatedAt,
  }
})

console.log('n', prevSpecs.length, specs.length)

await specColl.deleteMany({ username: 'classics' })
const res = await specColl.insertMany(specs, { upsert: true })
console.log('Inserted', (res?.insertedCount ?? 0) > 0 ? res.insertedCount : res)

process.exit()
