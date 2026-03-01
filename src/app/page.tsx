'use client'

import { useEffect, useMemo, useState } from 'react'
import { AppShell } from '../components/AppShell'
import { Button, Card, Input, SectionTitle, Select, Segmented, Skeleton, Toggle } from '../components/ui'
import { StationCard } from '../components/StationCard'
import { BottomSheet } from '../components/BottomSheet'
import { StationMap } from '../components/StationMap'
import { useLocale } from '../lib/useLocale'
import { useDebounce } from '../lib/useDebounce'
import { useOnline } from '../lib/useOnline'
import { getNearbyStations } from '../data/econtrol.api'
import { FuelType, GasStation } from '../domain/types'
import { haversineDistance, detectBrand } from '../domain/utils'
import { useFavorites } from '../store/favorites'
import { useSettings } from '../store/settings'

export default function HomePage() {
  const { t } = useLocale()
  const online = useOnline()
  const [fuelType, setFuelType] = useState<FuelType>('SUP')
  const [includeClosed, setIncludeClosed] = useState(false)
  const [stations, setStations] = useState<GasStation[]>([])
  const [loading, setLoading] = useState(false)
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [sortBy, setSortBy] = useState<'price' | 'distance'>('price')
  const [brandFilter, setBrandFilter] = useState('all')
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)
  const [view, setView] = useState<'list' | 'map' | 'split'>('list')
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [selectedStation, setSelectedStation] = useState<GasStation | null>(null)

  const { favorites, toggle, load } = useFavorites()
  const { defaultFuel, load: loadSettings } = useSettings()

  useEffect(() => {
    load()
    loadSettings()
  }, [load, loadSettings])

  useEffect(() => {
    setFuelType(defaultFuel)
  }, [defaultFuel])

  const brands = useMemo(() => {
    const set = new Set<string>()
    stations.forEach((s) => {
      const b = detectBrand(s)
      if (b) set.add(b)
    })
    return Array.from(set).sort()
  }, [stations])

  const withDistance = useMemo(() => {
    return stations.map((s) => {
      const distance = location ? haversineDistance(location.latitude, location.longitude, s.latitude, s.longitude) : undefined
      return { station: s, distance }
    })
  }, [stations, location])

  const filtered = useMemo(() => {
    const lower = debouncedSearch.toLowerCase()
    let data = withDistance.filter(({ station }) => {
      if (brandFilter !== 'all') {
        const b = detectBrand(station)
        if (b !== brandFilter) return false
      }
      if (!lower) return true
      const text = `${station.name ?? ''} ${station.address ?? ''}`.toLowerCase()
      return text.includes(lower)
    })
    data = data.sort((a, b) => {
      if (sortBy === 'distance') {
        return (a.distance ?? Infinity) - (b.distance ?? Infinity)
      }
      return a.station.price - b.station.price
    })
    return data
  }, [withDistance, brandFilter, debouncedSearch, sortBy])

  const onUseLocation = () => setShowLocationModal(true)

  const requestLocation = () => {
    setShowLocationModal(false)
    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords
        setLocation({ latitude, longitude })
        const data = await getNearbyStations(latitude, longitude, fuelType, includeClosed)
        setStations(data)
        setLoading(false)
      },
      () => setLoading(false),
      { enableHighAccuracy: false, timeout: 8000 }
    )
  }

  useEffect(() => {
    if (!location) return
    setLoading(true)
    getNearbyStations(location.latitude, location.longitude, fuelType, includeClosed)
      .then(setStations)
      .finally(() => setLoading(false))
  }, [location, fuelType, includeClosed])

  return (
    <AppShell>
      <div className="pt-6">
        {!online && (
          <div className="mb-4 rounded-2xl border border-amber-300 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-700 dark:bg-amber-900/40 dark:text-amber-200">
            {t('offlineNotice')}
          </div>
        )}

        <div className="mb-4 rounded-3xl border border-zinc-200 bg-gradient-to-br from-white to-zinc-50 p-5 shadow-sm dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-950">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{t('nearMe')}</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">{t('officialList')} • {stations.length} {t('results')}</div>
            </div>
            <Button size="lg" onClick={onUseLocation} disabled={loading}>{loading ? 'Loading…' : t('useMyLocation')}</Button>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-4">
            <Select value={fuelType} onChange={(e) => setFuelType(e.target.value as FuelType)}>
              <option value="DIE">Diesel</option>
              <option value="SUP">Super</option>
              <option value="GAS">Gas</option>
            </Select>
            <Toggle checked={includeClosed} onChange={setIncludeClosed} label={t('includeClosed')} />
            <Select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
              <option value="price">{t('cheapest')}</option>
              <option value="distance">{t('closest')}</option>
            </Select>
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
          <div className="grid gap-3 md:grid-cols-3">
            <Input placeholder={`${t('search')}...`} value={search} onChange={(e) => setSearch(e.target.value)} />
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

        {!loading && filtered.length === 0 && (
          <Card className="mt-6">
            <div className="text-sm text-zinc-500 dark:text-zinc-400">{t('noResults')}</div>
            <div className="mt-2 text-xs text-zinc-400">{t('enableLocationBody')}</div>
          </Card>
        )}

        {!loading && (view === 'list' || view === 'split') && (
          <div className="mt-4 grid gap-3">
            {filtered.map(({ station, distance }) => (
              <StationCard
                key={station.id}
                station={station}
                distanceMeters={distance}
                isFavorite={favorites.includes(station.id)}
                onToggleFavorite={toggle}
                t={t}
              />
            ))}
          </div>
        )}

        {!loading && (view === 'map' || view === 'split') && (
          <div className="mt-4 h-[60vh] overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800">
            <StationMap
              stations={stations}
              userLocation={location ?? undefined}
              onSelect={(s) => setSelectedStation(s)}
            />
          </div>
        )}
      </div>

      <BottomSheet open={!!selectedStation} onClose={() => setSelectedStation(null)}>
        {selectedStation && (
          <StationCard
            station={selectedStation}
            distanceMeters={location ? haversineDistance(location.latitude, location.longitude, selectedStation.latitude, selectedStation.longitude) : undefined}
            isFavorite={favorites.includes(selectedStation.id)}
            onToggleFavorite={toggle}
            t={t}
          />
        )}
      </BottomSheet>

      <BottomSheet open={showLocationModal} onClose={() => setShowLocationModal(false)}>
        <SectionTitle>{t('enableLocationTitle')}</SectionTitle>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">{t('enableLocationBody')}</p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setShowLocationModal(false)}>
            {t('cancel')}
          </Button>
          <Button onClick={requestLocation}>{t('continue')}</Button>
        </div>
      </BottomSheet>
    </AppShell>
  )
}
