import { create } from 'zustand'
import { FuelType } from '../domain/types'

const STORAGE_KEY = 'tankstelle:settings'

type SettingsState = {
  defaultFuel: FuelType
  locale?: string
  setDefaultFuel: (fuel: FuelType) => void
  load: () => void
}

export const useSettings = create<SettingsState>((set, get) => ({
  defaultFuel: 'SUP',
  setDefaultFuel: (fuel) => {
    set({ defaultFuel: fuel })
    if (typeof window !== 'undefined') {
      const current = { defaultFuel: fuel, locale: get().locale }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(current))
    }
  },
  load: () => {
    if (typeof window === 'undefined') return
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    try {
      const parsed = JSON.parse(raw)
      if (parsed.defaultFuel) set({ defaultFuel: parsed.defaultFuel })
      if (parsed.locale) set({ locale: parsed.locale })
    } catch {
      return
    }
  },
}))
