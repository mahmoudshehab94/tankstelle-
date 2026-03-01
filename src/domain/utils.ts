import { GasStation } from './types'

export function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3
  const toRad = (v: number) => (v * Math.PI) / 180
  const φ1 = toRad(lat1)
  const φ2 = toRad(lat2)
  const Δφ = toRad(lat2 - lat1)
  const Δλ = toRad(lon2 - lon1)
  const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export function buildCacheKey(parts: Array<string | number | boolean | null | undefined>): string {
  return parts.map((p) => String(p ?? '')).join('|')
}

const BRAND_HINTS: Array<{ brand: string; hints: string[] }> = [
  { brand: 'OMV', hints: ['omv'] },
  { brand: 'BP', hints: ['bp'] },
  { brand: 'Shell', hints: ['shell'] },
  { brand: 'ENI', hints: ['eni', 'agip'] },
  { brand: 'JET', hints: ['jet'] },
  { brand: 'TotalEnergies', hints: ['total'] },
  { brand: 'Avanti', hints: ['avanti'] },
  { brand: 'Turmöl', hints: ['turmöl', 'turmoel'] },
  { brand: 'Genol', hints: ['genol'] },
]

export function detectBrand(station: GasStation): string | undefined {
  if (station.brand) return station.brand
  const text = `${station.name ?? ''} ${station.address ?? ''}`.toLowerCase()
  for (const { brand, hints } of BRAND_HINTS) {
    if (hints.some((h) => text.includes(h))) return brand
  }
  return undefined
}

export function formatDistance(meters: number): string {
  if (!isFinite(meters)) return '-'
  if (meters < 1000) return `${Math.round(meters)} m`
  return `${(meters / 1000).toFixed(1)} km`
}
