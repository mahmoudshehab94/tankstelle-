import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, getServerCache, setServerCache } from '../_lib/cache'
import { fetchStationsByRegionServer } from '../_lib/econtrol.server'

const TTL = 5 * 60 * 1000

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'local'
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
  }
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code') || ''
  const type = (searchParams.get('type') || 'BL') as any
  const fuelType = (searchParams.get('fuelType') || 'SUP') as any
  const includeClosed = searchParams.get('includeClosed') === 'true'
  const key = `region:${code}:${type}:${fuelType}:${includeClosed}`
  const cached = getServerCache(key)
  if (cached) return NextResponse.json(cached)
  const data = await fetchStationsByRegionServer(code, type, fuelType, includeClosed)
  setServerCache(key, data, TTL)
  return NextResponse.json(data)
}
