import { FuelType, GasStation, Region } from '../domain/types'
import { buildCacheKey } from '../domain/utils'
import { getLocalCache, getMemoryCache, setLocalCache, setMemoryCache } from './cache'

const inflight = new Map<string, Promise<any>>()

const SEARCH_TTL = 5 * 60 * 1000
const REGIONS_TTL = 7 * 24 * 60 * 60 * 1000
const CACHE_PREFIX = 'tankstelle:'

async function fetchWithDedupe<T>(key: string, fn: () => Promise<T>): Promise<T> {
  if (inflight.has(key)) return inflight.get(key) as Promise<T>
  const promise = fn().finally(() => inflight.delete(key))
  inflight.set(key, promise)
  return promise
}

export async function getNearbyStations(lat: number, lon: number, fuelType: FuelType, includeClosed: boolean): Promise<GasStation[]> {
  const key = `${CACHE_PREFIX}nearby:${buildCacheKey([lat.toFixed(5), lon.toFixed(5), fuelType, includeClosed])}`
  const memory = getMemoryCache<GasStation[]>(key)
  if (memory) return memory
  const local = getLocalCache<GasStation[]>(key)
  if (local) {
    setMemoryCache(key, local, SEARCH_TTL)
    return local
  }
  const data = await fetchWithDedupe(key, async () => {
    const res = await fetch(`/api/econtrol/nearby?lat=${lat}&lon=${lon}&fuelType=${fuelType}&includeClosed=${includeClosed}`)
    if (!res.ok) throw new Error('Failed to fetch nearby stations')
    return (await res.json()) as GasStation[]
  })
  setMemoryCache(key, data, SEARCH_TTL)
  setLocalCache(key, data, SEARCH_TTL)
  return data
}

export async function getRegions(): Promise<Region[]> {
  const key = `${CACHE_PREFIX}regions`
  const memory = getMemoryCache<Region[]>(key)
  if (memory) return memory
  const local = getLocalCache<Region[]>(key)
  if (local) {
    setMemoryCache(key, local, REGIONS_TTL)
    return local
  }
  const data = await fetchWithDedupe(key, async () => {
    const res = await fetch('/api/econtrol/regions')
    if (!res.ok) throw new Error('Failed to fetch regions')
    return (await res.json()) as Region[]
  })
  setMemoryCache(key, data, REGIONS_TTL)
  setLocalCache(key, data, REGIONS_TTL)
  return data
}

export async function getStationsByRegion(code: string, type: 'BL' | 'PB', fuelType: FuelType, includeClosed: boolean): Promise<GasStation[]> {
  const key = `${CACHE_PREFIX}region:${buildCacheKey([code, type, fuelType, includeClosed])}`
  const memory = getMemoryCache<GasStation[]>(key)
  if (memory) return memory
  const local = getLocalCache<GasStation[]>(key)
  if (local) {
    setMemoryCache(key, local, SEARCH_TTL)
    return local
  }
  const data = await fetchWithDedupe(key, async () => {
    const res = await fetch(`/api/econtrol/by-region?code=${code}&type=${type}&fuelType=${fuelType}&includeClosed=${includeClosed}`)
    if (!res.ok) throw new Error('Failed to fetch region stations')
    return (await res.json()) as GasStation[]
  })
  setMemoryCache(key, data, SEARCH_TTL)
  setLocalCache(key, data, SEARCH_TTL)
  return data
}

export function clearClientCache(): void {
  if (typeof window === 'undefined') return
  Object.keys(window.localStorage).forEach((k) => {
    if (k.startsWith(CACHE_PREFIX)) window.localStorage.removeItem(k)
  })
}
