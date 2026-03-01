import { GasStation } from '../domain/types'

export function loadCachedStations(): GasStation[] {
  if (typeof window === 'undefined') return []
  const stations: GasStation[] = []
  for (const key of Object.keys(localStorage)) {
    if (!key.startsWith('tankstelle:')) continue
    try {
      const raw = localStorage.getItem(key)
      if (!raw) continue
      const parsed = JSON.parse(raw)
      const value = parsed.value
      if (Array.isArray(value)) {
        value.forEach((v) => {
          if (v && v.id && typeof v.latitude === 'number' && typeof v.longitude === 'number') stations.push(v)
        })
      }
    } catch {
      continue
    }
  }
  return stations
}
