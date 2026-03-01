import { create } from 'zustand'

const STORAGE_KEY = 'tankstelle:favorites'

type FavoritesState = {
  favorites: string[]
  toggle: (id: string) => void
  remove: (id: string) => void
  load: () => void
}

export const useFavorites = create<FavoritesState>((set, get) => ({
  favorites: [],
  toggle: (id) => {
    const current = new Set(get().favorites)
    if (current.has(id)) current.delete(id)
    else current.add(id)
    const next = Array.from(current)
    set({ favorites: next })
    if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  },
  remove: (id) => {
    const next = get().favorites.filter((f) => f !== id)
    set({ favorites: next })
    if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  },
  load: () => {
    if (typeof window === 'undefined') return
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      try {
        const arr = JSON.parse(raw) as string[]
        set({ favorites: arr })
      } catch {
        set({ favorites: [] })
      }
    }
  },
}))
