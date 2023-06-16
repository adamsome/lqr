import { readFileSync } from 'fs'
import { MongoClient } from 'mongodb'
import { resolve } from 'path'

import { loadEnvLocal } from './load-env-local.mjs'

loadEnvLocal()

const specsPath = resolve(process.cwd(), '../json/specs.json')
const specsJson = readFileSync(specsPath, 'utf-8')
const specDict = JSON.parse(specsJson)
const specIDs = Object.keys(specDict)
const specs = specIDs.map((id) => specDict[id])

const { MONGODB_DB, MONGODB_URI } = process.env
const client = new MongoClient(MONGODB_URI)
await client.connect()
const lqrDB = client.db(MONGODB_DB)
const specColl = lqrDB.collection('spec')

await specColl.deleteMany({})
const res = await specColl.insertMany(specs, { upsert: true })
console.log('res', res)

process.exit()
