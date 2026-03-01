import { FuelType, GasStation, Region } from '../../../../domain/types'
import { parseGasStations, parseRegions } from '../../../../data/econtrol.client'

const BASE_URL = 'https://api.e-control.at/sprit/1.0'

export async function fetchNearbyStationsServer(lat: number, lon: number, fuelType: FuelType, includeClosed: boolean): Promise<GasStation[]> {
  const url = `${BASE_URL}/search/gas-stations/by-address?latitude=${lat}&longitude=${lon}&fuelType=${fuelType}&includeClosed=${includeClosed}`
  const res = await fetch(url, { cache: 'no-store' })
  const json = await res.json()
  return parseGasStations(json)
}

export async function fetchRegionsServer(): Promise<Region[]> {
  const url = `${BASE_URL}/regions`
  const res = await fetch(url, { cache: 'no-store' })
  const json = await res.json()
  return parseRegions(json)
}

export async function fetchStationsByRegionServer(code: string, type: 'BL' | 'PB', fuelType: FuelType, includeClosed: boolean): Promise<GasStation[]> {
  const url = `${BASE_URL}/search/gas-stations/by-region?code=${code}&type=${type}&fuelType=${fuelType}&includeClosed=${includeClosed}`
  const res = await fetch(url, { cache: 'no-store' })
  const json = await res.json()
  return parseGasStations(json)
}
