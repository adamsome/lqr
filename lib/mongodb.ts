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

interface MongoCache {
  conn: MongoClientDb | null
  promise: Promise<MongoClientDb> | null
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached: MongoCache = (global as unknown as any)?.mongo

if (!cached) {
  cached = (global as any).mongo = { conn: null, promise: null }
}

export async function connectToDatabase(): Promise<MongoClientDb> {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    cached.promise = MongoClient.connect(MONGODB_URI!).then(
      (client): MongoClientDb => {
        return {
          client,
          db: client.db(MONGODB_DB),
        }
      },
    )
  }
  cached.conn = await cached.promise
  return cached.conn
}

export const FIND_NO_ID = { projection: { _id: false } }
