import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, getServerCache, setServerCache } from '../_lib/cache'
import { fetchRegionsServer } from '../_lib/econtrol.server'

const TTL = 7 * 24 * 60 * 60 * 1000

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'local'
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
  }
  const key = `regions`
  const cached = getServerCache(key)
  if (cached) return NextResponse.json(cached)
  const data = await fetchRegionsServer()
  setServerCache(key, data, TTL)
  return NextResponse.json(data)
}
