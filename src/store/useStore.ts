import { create } from 'zustand'
import { GasStation, FuelType, Region } from '../domain/types'

interface AppState {
  fuelType: FuelType
  includeClosed: boolean
  location: { latitude: number; longitude: number } | null
  stations: GasStation[]
  regions: Region[]
  selectedRegion: Region | null
  setFuelType: (fuelType: FuelType) => void
  setIncludeClosed: (include: boolean) => void
  setLocation: (lat: number, lon: number) => void
  setStations: (stations: GasStation[]) => void
  setRegions: (regions: Region[]) => void
  setSelectedRegion: (region: Region | null) => void
}

export const useStore = create<AppState>((set) => ({
  fuelType: 'SUP',
  includeClosed: false,
  location: null,
  stations: [],
  regions: [],
  selectedRegion: null,
  setFuelType: (fuelType) => set({ fuelType }),
  setIncludeClosed: (include) => set({ includeClosed: include }),
  setLocation: (latitude, longitude) => set({ location: { latitude, longitude } }),
  setStations: (stations) => set({ stations }),
  setRegions: (regions) => set({ regions }),
  setSelectedRegion: (region) => set({ selectedRegion: region }),
}))
