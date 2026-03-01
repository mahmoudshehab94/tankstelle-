export type FuelType = 'DIE' | 'SUP' | 'GAS'

export interface GasStation {
  id: string
  name?: string
  address?: string
  brand?: string
  latitude: number
  longitude: number
  price: number
  lastUpdate?: string
  isClosed?: boolean
}

export interface Region {
  code: string
  name: string
  type: 'BL' | 'PB'
}
