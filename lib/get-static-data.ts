import { StaticData } from '@/lib/types'

import 'server-only'

export async function getStaticData(): Promise<StaticData> {
  const path = `${process.env.NEXT_PUBLIC_BASE_URL}/api/staticdata`
  const staticDataResponse = await fetch(path, { cache: 'force-cache' })
  const staticDataJson = await staticDataResponse.json()
  return JSON.parse(staticDataJson)
}
