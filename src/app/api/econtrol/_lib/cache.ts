type CacheEntry<T> = { value: T; expiresAt: number }

const serverCache = new Map<string, CacheEntry<unknown>>()

export function getServerCache<T>(key: string): T | null {
  const entry = serverCache.get(key)
  if (!entry) return null
  if (Date.now() > entry.expiresAt) {
    serverCache.delete(key)
    return null
  }
  return entry.value as T
}

export function setServerCache<T>(key: string, value: T, ttlMs: number): void {
  serverCache.set(key, { value, expiresAt: Date.now() + ttlMs })
}

const rateMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 60
const WINDOW_MS = 60 * 1000

export function checkRateLimit(key: string): boolean {
  const now = Date.now()
  const entry = rateMap.get(key)
  if (!entry || now > entry.resetAt) {
    rateMap.set(key, { count: 1, resetAt: now + WINDOW_MS })
    return true
  }
  if (entry.count >= RATE_LIMIT) return false
  entry.count += 1
  return true
}
