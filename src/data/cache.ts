type CacheEntry<T> = {
  value: T
  expiresAt: number
}

const memoryCache = new Map<string, CacheEntry<unknown>>()

export function getMemoryCache<T>(key: string): T | null {
  const entry = memoryCache.get(key)
  if (!entry) return null
  if (Date.now() > entry.expiresAt) {
    memoryCache.delete(key)
    return null
  }
  return entry.value as T
}

export function setMemoryCache<T>(key: string, value: T, ttlMs: number): void {
  memoryCache.set(key, { value, expiresAt: Date.now() + ttlMs })
}

export function getLocalCache<T>(key: string): T | null {
  if (typeof window === 'undefined') return null
  const raw = window.localStorage.getItem(key)
  if (!raw) return null
  try {
    const parsed: CacheEntry<T> = JSON.parse(raw)
    if (Date.now() > parsed.expiresAt) {
      window.localStorage.removeItem(key)
      return null
    }
    return parsed.value
  } catch {
    return null
  }
}

export function setLocalCache<T>(key: string, value: T, ttlMs: number): void {
  if (typeof window === 'undefined') return
  const entry: CacheEntry<T> = { value, expiresAt: Date.now() + ttlMs }
  window.localStorage.setItem(key, JSON.stringify(entry))
}

export function clearLocalCache(prefix: string): void {
  if (typeof window === 'undefined') return
  const keys = Object.keys(window.localStorage)
  for (const k of keys) {
    if (k.startsWith(prefix)) window.localStorage.removeItem(k)
  }
}
