import { Db, MongoClient } from 'mongodb'

const { MONGODB_URI, MONGODB_DB } = process.env

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local',
  )
}

if (!MONGODB_DB) {
  throw new Error(
    'Please define the MONGODB_DB environment variable inside .env.local',
  )
}

interface MongoClientDb {
  client: MongoClient
  db: Db
}

/**
 * Global is used here to maintain a single client across hot reloads in
 * development. This prevents connections growing exponentially during API
 * Route usage. The driver connects lazily on the first operation, so the
 * client can be created synchronously (Better Auth needs it at import time).
 */
const globalForMongo = global as unknown as { mongo?: MongoClientDb }

const cached: MongoClientDb = (globalForMongo.mongo ??= (() => {
  const client = new MongoClient(MONGODB_URI)
  return { client, db: client.db(MONGODB_DB) }
})())

export const mongo = cached

export async function connectToDatabase(): Promise<MongoClientDb> {
  return cached
}

export const FIND_NO_ID = { projection: { _id: false } }
