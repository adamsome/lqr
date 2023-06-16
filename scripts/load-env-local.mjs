import { config } from 'dotenv'
import { resolve } from 'path'

export function loadEnvLocal() {
  const envPath = resolve(process.cwd(), '../.env.local')
  config({ path: envPath })
}
