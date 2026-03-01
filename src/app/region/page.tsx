'use client'

import { useEffect, useMemo, useState } from 'react'
import { AppShell } from '../../components/AppShell'
import { Button, Card, Input, SectionTitle, Select, Segmented, Skeleton, Toggle } from '../../components/ui'
import { StationCard } from '../../components/StationCard'
import { StationMap } from '../../components/StationMap'
import { BottomSheet } from '../../components/BottomSheet'
import { useLocale } from '../../lib/useLocale'
import { getRegions, getStationsByRegion } from '../../data/econtrol.api'
import { FuelType, GasStation, Region } from '../../domain/types'
import { haversineDistance, detectBrand } from '../../domain/utils'
import { useFavorites } from '../../store/favorites'
import { useDebounce } from '../../lib/useDebounce'
import { useSettings } from '../../store/settings'

export default function RegionPage() {
  const { t } = useLocale()
  const [regions, setRegions] = useState<Region[]>([])
  const [type, setType] = useState<'BL' | 'PB'>('BL')
  const [selected, setSelected] = useState<Region | null>(null)
  const [fuelType, setFuelType] = useState<FuelType>('SUP')
  const [includeClosed, setIncludeClosed] = useState(false)
  const [stations, setStations] = useState<GasStation[]>([])
  const [loading, setLoading] = useState(false)
  const [view, setView] = useState<'list' | 'map' | 'split'>('list')
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)
  const [brandFilter, setBrandFilter] = useState('all')
  const [selectedStation, setSelectedStation] = useState<GasStation | null>(null)

  const { favorites, toggle, load } = useFavorites()
  const { defaultFuel, load: loadSettings } = useSettings()

  useEffect(() => {
    load()
    loadSettings()
    getRegions().then(setRegions)
  }, [load, loadSettings])

  useEffect(() => {
    setFuelType(defaultFuel)
  }, [defaultFuel])

  const filteredRegions = useMemo(() => {
    const lower = debouncedSearch.toLowerCase()
    return regions.filter((r) => r.type === type && r.name.toLowerCase().includes(lower))
  }, [regions, type, debouncedSearch])

  const brands = useMemo(() => {
    const set = new Set<string>()
    stations.forEach((s) => {
      const b = detectBrand(s)
      if (b) set.add(b)
    })
    return Array.from(set).sort()
  }, [stations])

  const onSearch = async () => {
    if (!selected) return
    setLoading(true)
    const data = await getStationsByRegion(selected.code, type, fuelType, includeClosed)
    setStations(data)
    setLoading(false)
  }

  const filteredStations = useMemo(() => {
    return stations.filter((s) => {
      if (brandFilter === 'all') return true
      return detectBrand(s) === brandFilter
    })
  }, [stations, brandFilter])

  return (
    <AppShell>
      <div className="pt-6">
        <div className="mb-4 rounded-3xl border border-zinc-200 bg-gradient-to-br from-white to-zinc-50 p-5 shadow-sm dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-950">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{t('region')}</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">{t('officialList')} • {stations.length} {t('results')}</div>
            </div>
            <Button size="lg" onClick={onSearch}>{t('search')}</Button>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-4">
            <Select value={type} onChange={(e) => setType(e.target.value as any)}>
              <option value="BL">{t('bundesland')}</option>
              <option value="PB">{t('bezirk')}</option>
            </Select>
            <Input placeholder={t('search')} value={search} onChange={(e) => setSearch(e.target.value)} />
            <Select value={selected?.code || ''} onChange={(e) => setSelected(filteredRegions.find((r) => r.code === e.target.value) || null)}>
              <option value="">{t('selectRegion')}</option>
              {filteredRegions.map((r) => (
                <option key={r.code} value={r.code}>
                  {r.name}
                </option>
              ))}
            </Select>
            <Select value={fuelType} onChange={(e) => setFuelType(e.target.value as FuelType)}>
              <option value="DIE">Diesel</option>
              <option value="SUP">Super</option>
              <option value="GAS">Gas</option>
            </Select>
            <Toggle checked={includeClosed} onChange={setIncludeClosed} label={t('includeClosed')} />
            <Segmented
              value={view}
              onChange={(v) => setView(v as any)}
              options={[
                { value: 'list', label: t('list') },
                { value: 'map', label: t('map') },
                { value: 'split', label: t('split') },
              ]}
            />
          </div>
        </div>

        <Card className="mb-4">
          <div className="grid gap-3 md:grid-cols-2">
            <Select value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)}>
              <option value="all">{t('allBrands')}</option>
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </Select>
          </div>
        </Card>

        {loading && (
          <div className="mt-4 grid gap-3">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-28" />
            ))}
          </div>
        )}

        {!loading && (view === 'list' || view === 'split') && (
          <div className="mt-4 grid gap-3">
            {filteredStations.map((station) => (
              <StationCard
                key={station.id}
                station={station}
                isFavorite={favorites.includes(station.id)}
                onToggleFavorite={toggle}
                t={t}
              />
            ))}
          </div>
        )}

        {!loading && (view === 'map' || view === 'split') && (
          <div className="mt-4 h-[60vh] overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800">
            <StationMap stations={stations} onSelect={(s) => setSelectedStation(s)} />
          </div>
        )}
      </div>

      <BottomSheet open={!!selectedStation} onClose={() => setSelectedStation(null)}>
        {selectedStation && (
          <StationCard
            station={selectedStation}
            distanceMeters={undefined}
            isFavorite={favorites.includes(selectedStation.id)}
            onToggleFavorite={toggle}
            t={t}
          />
        )}
      </BottomSheet>
    </AppShell>
  )
}
