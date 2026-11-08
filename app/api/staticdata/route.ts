import { NextResponse } from 'next/server'

import { getStaticData } from '@/app/lib/model/static-data'

export async function GET() {
  return NextResponse.json(await getStaticData())
}
