import { z } from 'zod'
import { FuelType, GasStation, Region } from '../domain/types'

const RawStationSchema = z.object({
  id: z.union([z.string(), z.number()]),
  name: z.string().optional(),
  brand: z.string().optional(),
  open: z.boolean().optional(),
  location: z
    .object({
      address: z.string().optional(),
      postalCode: z.string().optional(),
      city: z.string().optional(),
      latitude: z.number().optional(),
      longitude: z.number().optional(),
    })
    .optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  address: z.string().optional(),
  prices: z
    .array(
      z.object({
        fuelType: z.string().optional(),
        amount: z.number().optional(),
      })
    )
    .optional(),
  price: z.number().optional(),
  lastUpdate: z.string().optional(),
  distance: z.number().optional(),
})

const RegionSchema = z.object({
  code: z.string(),
  name: z.string(),
  type: z.enum(['BL', 'PB']),
})

export function parseGasStations(data: unknown): GasStation[] {
  const parsed = z.array(RawStationSchema).parse(data)
  return parsed
    .map((s) => {
      const priceFromArray = s.prices?.find((p) => p.amount !== undefined)?.amount
      const lat = s.location?.latitude ?? s.latitude
      const lon = s.location?.longitude ?? s.longitude
      const address = s.location?.address || s.address
      const city = s.location?.city
      const postal = s.location?.postalCode
      const fullAddress = [address, postal, city].filter(Boolean).join(', ')
      if (lat === undefined || lon === undefined || (s.price === undefined && priceFromArray === undefined)) return null
      return {
        id: String(s.id),
        name: s.name,
        address: fullAddress || address,
        brand: s.brand,
        latitude: lat,
        longitude: lon,
        price: s.price ?? priceFromArray ?? 0,
        lastUpdate: s.lastUpdate,
        isClosed: s.open === false,
      } as GasStation
    })
    .filter(Boolean) as GasStation[]
}

export function parseRegions(data: unknown): Region[] {
  return z.array(RegionSchema).parse(data)
}

const BASE_URL = 'https://api.e-control.at/sprit/1.0'

export async function fetchNearbyStations(latitude: number, longitude: number, fuelType: FuelType, includeClosed: boolean): Promise<GasStation[]> {
  const url = `${BASE_URL}/search/gas-stations/by-address?latitude=${latitude}&longitude=${longitude}&fuelType=${fuelType}&includeClosed=${includeClosed}`
  const res = await fetch(url)
  const json = await res.json()
  return parseGasStations(json)
}

export async function fetchRegions(): Promise<Region[]> {
  const url = `${BASE_URL}/regions`
  const res = await fetch(url)
  const json = await res.json()
  return parseRegions(json)
}

export async function fetchStationsByRegion(code: string, type: 'BL' | 'PB', fuelType: FuelType, includeClosed: boolean): Promise<GasStation[]> {
  const url = `${BASE_URL}/search/gas-stations/by-region?code=${code}&type=${type}&fuelType=${fuelType}&includeClosed=${includeClosed}`
  const res = await fetch(url)
  const json = await res.json()
  return parseGasStations(json)
}
