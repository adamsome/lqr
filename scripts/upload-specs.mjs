import { compareAsc, parseISO } from 'date-fns'
import { readFileSync } from 'fs'
import { MongoClient } from 'mongodb'
import { resolve } from 'path'

import { loadEnvLocal } from './load-env-local.mjs'

loadEnvLocal()

const specsPath = resolve(process.cwd(), '../json/specs.json')
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
  .find({}, { projection: { _id: false } })
  .toArray()
const prevSpecDict = prevSpecs.reduce((acc, s) => {
  acc[s.id] = s
  return acc
}, {})
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

await specColl.deleteMany({})
const res = await specColl.insertMany(specs, { upsert: true })
console.log('res', (res?.insertedCount ?? 0) > 0 ? res.insertedCount : res)

process.exit()
