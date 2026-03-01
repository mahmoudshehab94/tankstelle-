import { describe, expect, it } from 'vitest'
import { buildCacheKey, haversineDistance } from './utils'

describe('haversineDistance', () => {
  it('calculates approximate distance between Vienna and Graz', () => {
    const vienna = { lat: 48.2082, lon: 16.3738 }
    const graz = { lat: 47.0707, lon: 15.4395 }
    const meters = haversineDistance(vienna.lat, vienna.lon, graz.lat, graz.lon)
    const km = meters / 1000
    expect(km).toBeGreaterThan(140)
    expect(km).toBeLessThan(160)
  })
})

describe('buildCacheKey', () => {
  it('builds deterministic cache keys', () => {
    const key = buildCacheKey(['nearby', 48.2, 16.3, true])
    expect(key).toBe('nearby|48.2|16.3|true')
  })
})
