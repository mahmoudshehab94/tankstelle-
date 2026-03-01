import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, getServerCache, setServerCache } from '../_lib/cache'
import { fetchNearbyStationsServer } from '../_lib/econtrol.server'

const TTL = 5 * 60 * 1000

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'local'
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
  }
  const { searchParams } = new URL(req.url)
  const lat = Number(searchParams.get('lat'))
  const lon = Number(searchParams.get('lon'))
  const fuelType = (searchParams.get('fuelType') || 'SUP') as any
  const includeClosed = searchParams.get('includeClosed') === 'true'
  const key = `nearby:${lat.toFixed(5)}:${lon.toFixed(5)}:${fuelType}:${includeClosed}`
  const cached = getServerCache(key)
  if (cached) return NextResponse.json(cached)
  const data = await fetchNearbyStationsServer(lat, lon, fuelType, includeClosed)
  setServerCache(key, data, TTL)
  return NextResponse.json(data)
}
